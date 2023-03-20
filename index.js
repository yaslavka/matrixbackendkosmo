require("dotenv").config();
const fs = require("fs");
const http = require("http");
const express = require("express");
const app = express();
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const router = require("./routes/index");
const ErrorHandlingMiddleware = require("./middleware/ErrorHandlingMiddleware");
const path = require("path");
const bodyParser = require('body-parser');
const { Op } = require("sequelize");
const createFakeMatrices = require("./service/createFakeMatrices");
const socketStart = require("./service/socketStart");
const { sochetStartChart } = require("./service/orderClose");
const multer = require("multer");
const UserControllers = require("./controllers/UserControllers");
const fileUpload = require("express-fileupload");
//const exchangeParser = require("./service/exchangeParser");

// const https = require("https");
// const privateKey = fs.readFileSync(
//   "/etc/letsencrypt/live/kosmoss.host/privkey.pem",
//   "utf8"
// );
// const certificate = fs.readFileSync(
//   "/etc/letsencrypt/live/kosmoss.host/cert.pem",
//   "utf8"
// );
// const ca = fs.readFileSync(
//   "/etc/letsencrypt/live/kosmoss.host/chain.pem",
//   "utf8"
// );
//
//
// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(fileUpload({}));
app.use("/api/user", express.static(path.resolve(__dirname, "files", "images")));
app.use(
    "/",
    express.static(path.resolve(__dirname, "files", "build"))
);
app.use(
    "/register",
    express.static(path.resolve(__dirname, "files", "build"))
);
app.use(
    "/login",
    express.static(path.resolve(__dirname, "files", "build"))
);
app.use("/api", router);
app.use(ErrorHandlingMiddleware);
const server = http.createServer(app);
//const httpsServer = https.createServer(credentials, app);
require('./service/io.js').init(server);
const io = require('./service/io.js').get();

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, './files/images');
  },
  filename(req, file, callback) {
    callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});
const upload = multer({ storage });
app.post('/api/user/avatars', upload.array('avatar'),UserControllers.avatars);

const typeMatrixSecondSumm = [
  600, 1800, 3600, 7200, 13000, 26000, 47000, 84000, 157000, 300000, 500000, 900000, 1000000
]

const typeMatrixThirdSumm = [
  300, 600, 1200, 2400, 4200, 8400, 15000, 28000, 50800, 91600, 170800, 319500, 590000
]

const writeOffMatrixTableCount = async () => {
  const updateStatistic = async (all_comet, all_planet) => {
    let update = { all_comet, all_planet }
    const allItems = await models.Statistic.update(update, { where: { id: { [Op.not]: 0 } } })
  }

  const summColumnStatistic = async () => {
    let resp = await models.Matrix_Table.findAll({
      attributes: [[
        sequelize.fn("sum", sequelize.col(`count`)), "all_count",
      ]]
    })
    return resp
  }

  const updateOrCreate = async function (where, newItem) {
    await models.Statistic.findOne({ where: where }).then(async function (foundItem) {
      (!foundItem) ? (await models.Statistic.create(newItem)) : (await models.Statistic.update(newItem, { where: where }))
    })
  }
  const matrices = await models.Matrix_Table.findAll({where: {count:{[Op.gte]: 6,}}})
  for (let i = 0; i < matrices.length; i++) {
    let updateCount = { count: matrices[i].count - 6 }
    await models.Matrix_Table.update(updateCount, { where: { id: matrices[i].id } })
    await updateOrCreate({ userId: matrices[i].userId }, { my_comet: updateCount.count })
    await createFakeMatrices()
  }
  if (matrices.length > 0){
    const fakeMatrices = await models.Matrix.findAll({where:{matrix_essence:11}})
    for (let j = 0; j < fakeMatrices.length; j++) {
      await models.Matrix.destroy({where:{id:fakeMatrices[j].id}})
    }
    const allPlanet = await models.Matrix_Table.count()
    const allComet = (await summColumnStatistic())[0].dataValues.all_count
    await updateStatistic(allComet, allPlanet)
  }
}


const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    server.listen(80, () => console.log(`server started on port 5000`));
    //httpsServer.listen(443, () => console.log(`server started on port 443`));
    const typeMatrixSecondCount = await models.TypeMatrixSecond.count()
    const typeMatrixThirdCount = await models.TypeMatrixThird.count()
    if (typeMatrixSecondCount === 0) {
      for (let i = 0; i < 13; i++) {
        await models.TypeMatrixSecond.create({
          summ: typeMatrixSecondSumm[i]
        })
      }
    }
    if (typeMatrixThirdCount === 0) {
      for (let i = 0; i < 13; i++) {
        await models.TypeMatrixThird.create({
          summ: typeMatrixThirdSumm[i]
        })
      }
    }
    const cloneStatSecondCount = await models.CloneStatSecond.count()
    const cloneStatThirdCount = await models.CloneStatThird.count()
    if (cloneStatSecondCount === 0) {
      for (let i = 0; i < 13; i++) {
        await models.CloneStatSecond.create({
          count: 0,
          level: i + 1
        })
      }
    }
    if (cloneStatThirdCount === 0) {
      for (let i = 0; i < 13; i++) {
        await models.CloneStatThird.create({
          count: 0,
          level: i + 1
        })
      }
    }

    //setInterval(writeOffMatrixTableCount, 10000);
    //setInterval(async ()=>{exchangeParser('all')}, 6 * 60 * 60 * 1000);
    io.on("connection", async(socket) => {
      try {
        await socketStart(socket)
        await sochetStartChart(socket)
      } catch (error) {
        console.log(error);
      }

    });

    // while (true) {
    //   await exchangeParser('top')
    // }

  } catch (error) {
    console.log(error);
  }
};
start();


