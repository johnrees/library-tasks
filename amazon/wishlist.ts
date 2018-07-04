import { uniq } from "lodash";
import * as fetch from "node-fetch";
import * as ISBN from "sentient-isbn";

function constructUrl(tld, id, lek) {
  const params = {
    filter: "DEFAULT",
    lek,
    sort: "default",
    type: "wishlist",
    ajax: true
  };
  const rootUrl = `https://www.amazon.${tld}/hz/wishlist/ls/${id}`;
  const queryString = Object.keys(params)
    .filter(k => params[k])
    .map(k => `${k}=${params[k]}`)
    .join("&");
  const url = [rootUrl, queryString].join("?");
  return url;
}

async function getWishList(listId, isbns = [], lek?: string) {
  const url = constructUrl("co.uk", listId, lek);

  console.log("Loading ", url);
  const response = await fetch(url, {
    method: "GET",
    mode: "cors"
  });
  const body = await response.text();

  const currentIsbns = isbns.concat(
    body
      .match(/ASIN:([A-Z0-9]+)\|([A-Z0-9]+)/g)
      .slice(1)
      .reduce((acc, curr) => {
        try {
          console.log(curr);
          const isbn10 = curr.match(/ASIN:([A-Z0-9]+)/)[1];
          const isbn = new ISBN({ isbn10 });
          acc.push(isbn.isbn13());
        } catch (e) {}
        return acc;
      }, [])
  );

  const lastItemId = body.match(/"lastEvaluatedKey"\s*?:\s*?"([0-9a-z\-]+)"/);
  if (lastItemId && lastItemId.length > 1) {
    await getWishList(listId, currentIsbns, lastItemId[1]);
  } else {
    console.log(uniq(currentIsbns));
  }
}

getWishList("2HJ2OV0UAVT97");
