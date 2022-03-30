const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'gktoday',
        address: 'https://www.gktoday.in/current-affairs/',
        base: ''
    },
    {
        name: 'google news',
        address: 'https://news.google.com/topstories?hl=en-IN&gl=IN&ceid=IN:en',
        base: ''
    },
    // {
    //     name: 'thetimes',
    //     address: 'https://www.thetimes.co.uk/environment/climate-change',
    //     base: ''
    // },
    // {
    //     name: 'guardian',
    //     address: 'https://www.theguardian.com/environment/climate-crisis',
    //     base: '',
    // },
]


// Working piece of code
// $('a:contains("s")', html).each(function () {
//     const title = $(this).text()
//     const url = $(this).attr('href')

//     articles.push({
//         id: id++,
//         title,
//         url: newspaper.base + url,
//         source: newspaper.name
//     })
// })

const articles = []
let id = 1

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('p:contains("k")', html).each(function () {
                const title = $(this).text()
                // const url = $(this).attr('href')

                articles.push({
                    id: id++,
                    title,
                    // url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

articles.push({
    id: 10,
    title: "Rein Welder appointed as CEO of Rein Corps",
    url: "www.google.com",
    source: "gktoday"
})

app.get('/', (req, res) => {
    res.json('Welcome to my Current Affairs News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("climate")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))