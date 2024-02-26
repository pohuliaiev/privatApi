const axios = require("axios")

let privatData = async function(req){
    let data = {};
  async function status() {
    const url = req;
    const response = await axios.get(url);
    data = response.data;
  }
  await status();
  console.log(data);
  return data
}


module.exports = privatData