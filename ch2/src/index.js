// const express = require('express')
import express from 'express'
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('hi this pooja kushwa jkkkk kjjjkk ')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})