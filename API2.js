/*created a simple server with the simple routing plus, used json to make api for fetching
data. */

const http = require('http');
const url = require('url');
const fs = require('fs');

const templateOverview = fs.readFileSync(`${__dirname}/templates/templateOverview.html`, "utf-8");
const templateProduct = fs.readFileSync(`${__dirname}/templates/templateProduct.html`, "utf-8");
const templateCard = fs.readFileSync(`${__dirname}/templates/templateCard.html`, "utf-8");
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const objData = JSON.parse(data);

const replaceTemplate = (temp, product) => {
     let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
     output = output.replace(/{%IMAGE%}/g, product.image);
     output = output.replace(/{%PRICE%}/g, product.price);
     output = output.replace(/{%FROM%}/g, product.from);
     output = output.replace(/{%QUANTITY%}/g, product.quantity);
     output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
     output = output.replace(/{%DESCRIPTION%}/g, product.description);
     output = output.replace(/{%ID%}/g, product.id);
     if(product.origin) output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
     return output;
}

const server = http.createServer((req, res)=>{

     const {query, pathname} = url.parse(req.url, true);
     //overview
     if(pathname === "/" || pathname === "/overview"){
          res.writeHead(200, {"Content-Type":"text/html"});
          const cardsHtml = objData.map(el => replaceTemplate(templateCard, el)).join("");
          const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
          res.end(output);
     }
     //product
     else if(pathname === "/product"){
          res.writeHead(200,{"Content-Type":"text/html"});
          const product = objData[query.id];
          const output = replaceTemplate(templateProduct, product);
          res.end(output);
     }
     else{
          res.writeHead(404, {"Content-Type":"text/html"});
          res.end("Page Not Found");
     }
});

server.listen(8000, '127.0.0.1', ()=>{
     console.log('listening the requests on port 8000');
});

