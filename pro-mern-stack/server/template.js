export default function template(body, initialState) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1.0" />
        <title> Pro MERN Static</title>
        <link rel="stylesheet" href="https://cdn.bootcss.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <style>
            .panel-title a { display:block; width:100%; cursor: pointer; }
        </style>
    </head>
    <body>
        <div id="contents" >${body}</div>
        <script>window._INITIAL_STATE_ = ${JSON.stringify(initialState)}</script>
        <script src="https://unpkg.com/ionicons@4.5.5/dist/ionicons.js"></script>
        <script src="/vendor.bundle.js"></script>
        <script type="text/javascript" src="/app.bundle.js"></script>
    </body>
    </html>
    `;
}