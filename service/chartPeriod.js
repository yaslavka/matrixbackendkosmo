

module.exports = async (periods) => {
    let result = []
    periods.map((i) => {
        let prices = []
        let volume = 0 
        i.periodArr.map((j) => {
            prices.push(+j.price)
            volume = volume + (+j.total)
        })
        let open = prices[0]
        let close = prices[prices.length - 1]
        let sortedPrices = [...prices.sort((a, b) => b - a)];
        let high = sortedPrices[0]
        let low = sortedPrices[sortedPrices.length - 1]
        result.push({ date: `${i.date}`, open: `${open}`, close: `${close}`, high:`${high}`, low:`${low}`, volume:`${volume}` })
    })
    return result    
}