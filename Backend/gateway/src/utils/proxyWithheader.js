import proxy from "express-http-proxy";


export const proxyWithheader=(serviceUrl,servicePath)=>{
    return proxy(serviceUrl, {
        proxyReqPathResolver: (req) => {
          return `${servicePath}${req.url}`;
        },
        proxyReqOptDecorator:(proxyReqOpts,req)=>{
            if(req.user){
                proxyReqOpts.headers["x-user-id"]=req.user?._id
            }
            return proxyReqOpts
        }
      });
}