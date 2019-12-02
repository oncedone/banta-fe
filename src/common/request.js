const aa = {
    a: 12,
    b: 12,
    c: 34,
};
const bb = ["12", 123];
//
export const request = ({ url }) => {
    return new Promise((req, res) => {
        uni.request({
            url,
            success() {},
            fail() {},
            complete() {},
        });
    });
};
