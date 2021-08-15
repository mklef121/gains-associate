/**
 * Use streams to make sure file is consumed from network in bits so as to save memory and wait time
 */
export const getFileStreamAndProcess = () => {
    return fetch('/test-instance.json')
        .then((response) => response.body)
        .then((body) => {
            const reader = body?.getReader()
            return new ReadableStream({
                start(controller) {
                    return pump();
                    function pump(): any {
                        return reader?.read().then(({ done, value }) => {
                            // When no more data needs to be consumed, close the stream
                            if (done) {
                                controller.close();
                                return;
                            }
                            // Enqueue the next data chunk into our target stream
                            controller.enqueue(value);
                            return pump();
                        });
                    }
                }
            })
        })
        .then(stream => new Response(stream))
        .then(response => response.text())
        .then((text): any[] => JSON.parse(text));
}