process.on('message', function (m) {
    process.send(Buffer(1000))
});