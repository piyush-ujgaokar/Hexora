import proxy from "express-http-proxy";


export const proxyWithheader=(serviceUrl)=>{
    return proxy(serviceUrl, {
        proxyReqPathResolver: (req) => {
          return `/project${req.url}`;
        },
        proxyReqOptDecorator:(proxyReqOpts,req)=>{
            if(req.user){
                proxyReqOpts.headers["x-user-id"]=req.user?._id
            }
            return proxyReqOpts
        }
      });
}