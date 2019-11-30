


// 
export const request = ({ url, }) => {
    return new Promise((req, res) => {

        uni.request({
            url,
            success() {

            },
            fail() {

            },
            complete() {

            },
        });
    });
}