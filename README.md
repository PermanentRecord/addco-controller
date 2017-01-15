# ADDCO Sign Controller

## Overview
WIP for interacting with ADDCO traffic signs via a Mirasan gateway using Node.js

## Environment variables

* ```USERNAME``` – Mirasan username
* ```PASSWORD``` – Mirasan password
* ```BASE_URL``` – Base URL for interaction (e.g. https://something.addco.com)
* ```NODE_TLS_REJECT_UNAUTHORIZED``` – Should be set to zero unless you want to install your own local cert.

## Build commands

* ```npm start``` – Runs system in production mode
* ```npm run dev``` – Runs system in development mode

## Methods

* ```addMessage(message,divisionId,cmsId)```
* ```getMessageList(divisionId,cmsId)```

## Source documents

When requesting an area's data via getArea(), the resulting JSON doc looks like this:
```
{ Layer:
 { Coords: 'gbtqGbvvuP{xZj{dA`s{@djq@q~k@_kVn`b@cyVvnCkme@}bM`tCqcTtal@',
   MIdGrps: [ '10|{}|901', 'uuvyHeF_^o_@yB}WgC' ],
   MIds: [ '2|5201602|3018' ], // 0|cmsId|divisionId
   MImgIds: 'kA??????|@',
   PlIdGrps: [],
   PlIds: [],
   PlDetails: [],
   PgIdGrps: [],
   PgIds: [],
   PgDetails: [],
   Overlays: [] },
   Weather: null }
```
