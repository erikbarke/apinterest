using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace Apinterest.Resources
{
    public class ResourceLookup : IResourceLookup
    {
        private readonly Assembly _assembly;
        private static readonly Regex NumberRegex = new Regex("(?<number>[\\d]+)");

        public ResourceLookup(string assemblyName)
            : this(GetAssembly(assemblyName))
        {}

        public ResourceLookup(Assembly assembly)
        {
            _assembly = assembly;
        }

        public string GetString(string name)
        {
            var resourceName = FindByName(name);

            using (var stream = _assembly.GetManifestResourceStream(resourceName))
            {
                if (stream != null)
                {
                    using (var reader = new StreamReader(stream))
                    {
                        return reader.ReadToEnd();
                    }
                }
            }

            return "";
        }

        private string FindByName(string name)
        {
            var resourceName = FormatUrlAsResourceName(name);

            foreach (var item in _assembly.GetManifestResourceNames())
            {
                if (item.EndsWith(resourceName))
                {
                    return item;
                }
            }

            throw new ArgumentException("Resource " + resourceName + " does not exist in assembly " + _assembly + ". Parameter value: " + name);
        }

        private static string FormatUrlAsResourceName(string name)
        {
            var resourceName = "";
            var split = name.Split('/');

            for (var i = 0; i < split.Length - 1; i++)
            {
                var folder = split[i];
                folder = NumberRegex.Replace(folder, "_${number}");
                folder = folder.Replace('-', '_');
                folder = folder.Replace("__", "_");

                resourceName += folder + ".";
            }

            resourceName += split[split.Length - 1];

            return resourceName;
        }

        private static Assembly GetAssembly(string name)
        {
            return AppDomain.CurrentDomain
                .GetAssemblies()
                .FirstOrDefault(a => a.ManifestModule.Name == name);
        }
    }
}
