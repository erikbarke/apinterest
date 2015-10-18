Apinterest
==========

### Overview
Apinterest is a json centered documentation and test tool for RESTful service routes, complete
with request and response samples, data type validation, syntax help and syntax highlighting.

Information on available routes is collected runtime by the server, which eliminates the need
for documenting the api manually and keeping track of changes.

The project comprises a Javascript/AngularJS browser client and a C#/Microsoft Web Api RESTFul server.


### Features

* **Instant documentation**:

  * Listing of available routes.
  * Quick search function: filter on relative paths and http verbs.
  * Route details such as controller names, controller method names and assembly names.
  * Samples of response and request json documents.

* **Route test runner**:

   * Syntax highlighting.
   * Syntax and type safe editing of path and querystring parameters.
   * Syntax and type safe editing of request parameter json documents and request body
     json documents.
   * Listing of enums.
   * Raw editor for copying, pasting and editing json documents.
   * Builtin support for accessing endpoints which require authentication with an oauth
     token.
   * Last used username and password are stored per route.
   * Formatting of json, javascript and plaintext responses.
   * Optional file upload.

* **Security**:

   * The server only serves requests from localhost.
   * Stored user credentials are encrypted with AES/Rijndael.

### Requirements

* .Net 4.5 or higher.
* Visual Studio 2013 or newer.

### Try it out

1. Download or clone this repository.
2. Open src/server/webapi/Apinterest.sln in Visual Studio.
3. Go to "Tools", "NuGet Package Manager", choose "Manage NuGet Packages for Solution" and download
   the packages needed for the application.
4. In the Properties dialog for Apinterest.DemoServer, go to the tab "Web" and under "Start Action",
   choose "Specific Page" and set it to 'apinterest', without the single quotes.
5. Build the solution and hit F5.
6. For routes that require authentication, use test/test.

### Try it out in your own project:

1. In the new project dialog in Visual Studio, choose the template "ASP.NET Web
   Application" and name it, for instance, WebApplication1. In the next dialog that opens,
   choose "Web Api" and click "Ok".

2. Download the source for Apinterest and unpack the whole folder structure in the same
   directory as the WebApplication1 solution.

3. Add the Apinterest server project to the WebApplication1 solution and add a reference
   from the WebApplication1 project to the Apinterest project.

4. Make sure the versions of the Microsoft.AspNet.WebApi* and Newtonsoft components in
   the package.config file for WebApplication1 match the versions in the Apinterest
   package.config file.

   If they differ, use the Nuget Package Manager Console to get the right versions for the
   WebApplication1 project:

   `Update-Package Microsoft.AspNet.WebApi.Client -ProjectName WebApplication1 -Version x.x.x`

   The solution might build if the verions differ but the Apinterest assembly won't be loaded
   when running the application.

5. In the Web.config file for WebApplication1, add

   `<modules runAllManagedModulesForAllRequests="true" />` in `<system.webServer>`.

   Without this the Apinterest server component won't be able to serve the files for the client
   application.

6. In the Properties dialog for WebApplication1, go to the tab "Web" and under "Start Action",
   choose "Specific Page" and set it to 'apinterest', without the single quotes.

7. Set the WebApplication1 project as startup project and hit F5. Your default browser should
   open with the address http://localhost:portnumber/apinterest, and you should now see the
   Apinterest client, with a list of the routes in the WebApplication1 project.

### Licensing

This software is licensed with the MIT license.

© 2015 Erik Barke
