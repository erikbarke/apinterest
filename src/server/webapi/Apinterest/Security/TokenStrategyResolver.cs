using System;
using System.IO;
using System.Reflection;
using Newtonsoft.Json;

namespace Apinterest.Security
{
    public class TokenStrategyResolver
    {
        public TokenStrategy Resolve()
        {
            var configPath = Path.Combine(AppDomain.CurrentDomain.RelativeSearchPath, Assembly.GetExecutingAssembly().GetName().Name + ".json");
            return JsonConvert.DeserializeObject<TokenStrategy>(File.ReadAllText(configPath));
        }
    }
}
