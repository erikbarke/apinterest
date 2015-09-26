using System;
using System.IO;
using System.Web.Http;
using Apinterest.DemoServer.MinimalOAuthWebApi;
using log4net.Config;

namespace Apinterest.DemoServer
{
    public class WebApiApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            var logConfigPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "log4net.config");
            XmlConfigurator.Configure(new FileInfo(logConfigPath));

            GlobalConfiguration.Configure(WebApiConfig.Register);
        }
    }
}
