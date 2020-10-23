# Rethinking back-end pagination

#### my original API design

assuming 20 items per page, 

##### pagination

| URL                 | API                                              |
| ------------------- | ------------------------------------------------ |
| localhost:3000/?p=1 | GET(localhost:3003/api/blogs?limit=20&offset=0)  |
| localhost:3000/?p=2 | GET(localhost:3003/api/blogs?limit=20&offset=20) |
| localhost:3000/?p=3 | GET(localhost:3003/api/blogs?limit=20&offset=40) |

##### pagination with multi-column sorting support

| URL                                     | API                                                          |
| --------------------------------------- | ------------------------------------------------------------ |
| localhost:3000/?p=1&sort=most-commented | GET(localhost:3003/api/blogs?limit=20&offset=0&sort=commentsCount:desc |

however, using `Offset pagination` method has two problems 

1) page drift, and

2) slower performance when `offset` is huge.(for later pages retrieval)

### KEYSET(SEEK) PAGINATION : BETTER APPROACH

Instead of `offset`, use a `where` filter to remove the rows from previous pages.

<b>sort by most liked</b> 

assuming each post has unique `likesCount`. i.e. there are no two or more blog posts with same `likesCount`. 

```
SELECT * FROM 'blogs'
ORDER BY `likesCount` DESC
LIMIT 20
WHERE `likesCount` < {previous page last item's likesCount value}
```

As `likesCount` is not unique for post object, i need to beef up my `ORDER BY` clause, by adding an additional unique column `id` into my `ORDER BY` clause. You should *always* have an unique, unambiguous sorting criteria to get deterministic results.

```
SELECT * FROM 'blogs'
ORDER BY `likesCount` DESC, `id` DESC
LIMIT 20
WHERE (likesCount, id) < ({ previous page last item's likesCount value }, { previous page last item's id })
* CREATE INDEX ON (likesCount DESC, id DESC)
```

the above WHERE clause basically means, 

```
WHERE (likesCount < {previous page last item's likesCount value}) 
	OR (likesCount = {previous page last item's likesCount value} AND id < { previous page last item's id })
```

It should be noted that above syntax is not recognized in SQL (https://use-the-index-luke.com/sql/partial-results/fetch-next-page), so you would need to write in a different syntax yet with same logic. It is the same case for sorting by latest.

```
WHERE (likesCount <= ?)
	AND NOT (likesCount = ? AND id >= ? )
```

<b>sort by latest (date desc)</b>

```
SELECT * FROM 'blogs'
ORDER BY 'createdAt' DESC, `id` DESC
LIMIT 20
WHERE (createdAt, id) < ({ previous page last item's timestamp }, { previous page last item's id })
* CREATE INDEX ON (createdAt DESC, id DESC)
```

the above WHERE clause basically means, 

```
WHERE (createdAt < { previous page last item's timestamp })
	OR (createdAt = {previous page last item's timestamp} AND id < { previous page last item's id }
```

However, assuming our userbase is small, we can safely assume `createdAt` is unique for blog posts. Thus, you can simplify SQL query as : 

```
SELECT * FROM 'blogs'
ORDER BY 'createdAt' DESC
LIMIT 20
WHERE (createdAt) < { previous page last item's timestamp }
```

### implementation planning

<b>URL design</b>

| URL                                 |
| ----------------------------------- |
| localhost:3000/?sort=most-commented |
| localhost:3000/?sort=most-liked     |
| localhost:3000/?sort=most-recent    |

<b> API design </b>

baseURL = GET(localhost:3003/api/blogs?)

> query parameters

| function   | implementation                                               |
| ---------- | ------------------------------------------------------------ |
| sort       | constrained to [commentsCount, likesCount, createdAt].default `createdAt` |
| order      | constrained to [desc, asc]. default `desc`.                  |
| limit      | 20 by default if not provided by client. 100 maximum         |
| pagination | For initial call, `null` , For subsequent calls, next=[lastItem.fieldName]_[lastItem.id]. if sort column was `createdAt`, next parameter value need to be url-encoded first. |

<b>response data schema </b>

```
{
	blogs: [{...}, {...}, {...}, ...{...}],
	next: '...&next=[lastItem.fieldName]_[lastItem.id]' | null,
	hasNext: true | false
	
}
```



<b>  useful links </b>

openapi: 

https://swagger.io/docs/specification/basic-structure/

https://apisyouwonthate.com/blog/server-side-validation-with-api-descriptions

https://github.com/OAI/OpenAPI-Specification/blob/master/examples/v3.0/petstore.json

https://developers.redhat.com/blog/2019/01/14/building-a-node-js-service-using-the-api-first-approach/

https://developer.ibm.com/recipes/tutorials/builds-apis-with-node-js-express-and-openapi-3/

 https://swagger.io/docs/specification/describing-responses/

mongodb-specific syntax:

https://engineering.mixmax.com/blog/api-paging-built-the-right-way



#### Resources

https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/ ✅

https://use-the-index-luke.com/no-offset ✅

https://blog.jooq.org/2013/10/26/faster-sql-paging-with-jooq-using-the-seek-method/ ✅

https://blog.jooq.org/2013/11/18/faster-sql-pagination-with-keysets-continued/ ✅

https://dzone.com/articles/why-most-programmers-get-pagination-wrong  ✅

https://www.percona.com/blog/2017/04/07/non-deterministic-order-select-limit/ ✅

https://use-the-index-luke.com/sql/partial-results/fetch-next-page ✅

https://use-the-index-luke.com/sql/sorting-grouping/indexed-order-by ✅

https://www.codementor.io/@arpitbhayani/fast-and-efficient-pagination-in-mongodb-9095flbqr ✅

https://scalegrid.io/blog/fast-paging-with-mongodb/  ✅

https://www.taniarascia.com/rest-api-sorting-filtering-pagination/ ✅

https://use-the-index-luke.com/sql/where-clause/the-equals-operator/concatenated-keys ✅

*additional resources i've looked at today (16/10)

https://engineering.mixmax.com/blog/api-paging-built-the-right-way ✅

https://developer.twitter.com/en/docs/pagination ✅

https://stripe.com/docs/api/pagination  ✅

https://jsao.io/2018/08/creating-a-rest-api-manual-pagination-sorting-and-filtering/ ✅

https://levelup.gitconnected.com/node-js-filtering-sorting-and-pagination-50ce6c90d0ad ✅

https://stackoverflow.com/questions/55049303/node-expressjs-how-to-pass-custom-query-params-validation ✅ (good)

https://www.freecodecamp.org/news/how-to-make-input-validation-simple-and-clean-in-your-express-js-app-ea9b5ff5a8a7/ ✅

https://apisyouwonthate.com/blog/server-side-validation-with-api-descriptions ✅ (good)

https://www.freecodecamp.org/news/how-to-perform-custom-validation-in-your-express-js-app-432eb423510f/ ✅

https://apisyouwonthate.com/blog/the-many-amazing-uses-of-json-schema-client-side-validation

https://apisyouwonthate.com/blog/writing-documentation-via-contract-testing ✅

https://apisyouwonthate.com/blog/understanding-rpc-rest-and-graphql ✅

https://apisyouwonthate.com/blog/turning-contracts-into-beautiful-documentation ✅

https://apisyouwonthate.com/blog/representing-state-in-rest-and-graphql ✅

https://www.smashingmagazine.com/2016/09/understanding-rest-and-rpc-for-http-apis/

https://apisyouwonthate.com/blog/graphql-vs-rest-overview ✅

https://jsonapi.org/ : JSON specs for sorting/filtering/pagination ✅

https://json-schema.org/ ✅

https://apisyouwonthate.com/blog/rest-and-hypermedia-in-2019 ✅



# Front-end infinite scroll

https://codesandbox.io/s/blissful-kalam-qkzvp?file=/src/index.js

