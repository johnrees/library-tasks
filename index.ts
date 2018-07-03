import * as fetch from "node-fetch";

async function searchByISBN({
  isbn = "9781423107668",
  region = "conwy_en"
} = {}) {
  let { url } = await fetch(
    `https://wales.ent.sirsidynix.net.uk/client/en_GB/${region}/search/results?qu=${isbn}&te=&rt=false%7C%7C%7CISBN%7C%7C%7CISBN`,
    {
      credentials: "include",
      headers: {},
      body: null,
      method: "GET",
      mode: "cors"
    }
  );
  const [_url, ent, qu] = url.match(/.+\/(ent:.+)\/.+(qu=[0-9A-Z]+)/);
  console.log({ _url, ent, qu });

  let json;

  // get availability
  url = `https://wales.ent.sirsidynix.net.uk/client/en_GB/conwy_en/search/detailnonmodal.detail.detailitemstable_0.webservicefieldsajax:lookupavailability/detailItemsDiv0/${ent}/ILS/0/false?${qu}&d=ent%3A%2F%2FSD_ILS%2F0%2FSD_ILS%3A878630%7E%7E0`;
  json = await fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    },
    referrer: _url,
    body: null,
    method: "POST",
    mode: "cors"
  });
  json = await json.json();
  console.log(json);

  // get list of libraries
  url = `https://wales.ent.sirsidynix.net.uk/client/en_GB/conwy_en/search/detailnonmodal.detail.detailitemstable_0.webservicefieldsajax:lookuptitleinfo/detailItemsDiv0/${ent}/ILS/true/true?${qu}&d=ent%3A%2F%2FSD_ILS%2F0%2FSD_ILS%3A878630%7E%7E0`;
  json = await fetch(url, {
    headers: {
      "X-Requested-With": "XMLHttpRequest"
    },
    referrer: _url,
    body: null,
    method: "POST",
    mode: "cors"
  });
  json = await json.json();
  console.log(json);
}

searchByISBN({ isbn: "9781423107668" });
