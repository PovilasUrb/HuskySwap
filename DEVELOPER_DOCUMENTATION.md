*Setting Up and Running Source Code*

The source code can be obtained by cloning the repository hosted at https://github.com/jdkaim/HuskySwap.

To set up the **BACKEND**, you must:

Download .NET if you have not already: https://dotnet.microsoft.com/en-us/download

Navigate to the src directory:

    cd src

Restore .NET Core dependencies

    dotnet restore

Run the application

    dotnet run --project LightNap.WebApi

To set up the **FRONTEND**, you must:

Navigate to the lightnap-ng directory in a different terminal

    cd src/lightnap-ng

Install Angular dependencies

    npm install

Run the Angular app

    npm run start

The website will be hosted locally on http://localhost:4200

----------------------------------------------------------------------------------

*Directory Structure*

The directory contains four folders at the top level. These are **.github** (which contains workflows), **docs** (which contains documentation), **reports** (which contains weekly reports of development progress), and **src** (which contains the code).

Inside **src**, there are seven folders. These are:
- LightNap.Core: .NET shared library for common server-side components.
- LightNap.Core.Tests: Test library for LightNap.Core.
- LightNap.DataProviders.Sqlite: SQLite data provider implementation including migrations and utilities.
- LightNap.DataProviders.SqlServer: SQL Server data provider implementation including migrations and utilities.
- LightNap.MaintenanceService: .NET Core console project to run maintenance tasks.
- LightNap.WebApi: .NET Core Web API project.
- lightnap-ng: Angular project with PrimeNG components based on the sakai-ng template.

Entities can be added in src/LightNap.Core/Data/Entities.

Controllers for the WebApi are located in src/LightNap.WebApi/Controllers.

Frontend configuration is located in src/lightnap-ng/src/app.

----------------------------------------------------------------------------------

*Testing*

To test the **BACKEND**, you must:

Navigate to the src directory:

    cd src

Restore .NET Core dependencies

    dotnet restore

Run testing

    dotnet test

Tests can be added in LightNap.Core.Tests. Tests should be put in a new folder under LightNap.Core.Tests if they don't fall under a preexisting folder's category. There are no naming conventions for new tests, if they are under the folder please name them with sanity. Standard .NET testing structures should be used, and one can model existing tests to do so.

To test the **FRONTEND**, you must:

Navigate to the lightnap-ng directory in a different terminal

    cd src/lightnap-ng

Install Angular dependencies

    npm install

Run tests

    npm test

Tests can be added in lightnap-ng in the same folders as the code that they intend to test. The files should be given the same name as the file they desire to test, however the suffix must be changed from .ts to .spec.ts. Tests use Jasmine and Karma for Angular, and one can model existing tests to do so.

----------------------------------------------------------------------------------

*Building*

When a commit is merged to the main branch, it will automatically kick off a completely automated CI/CD pipeline that will build the project and deploy it to https://husky-swap.azurewebsites.net. If the build does not pass CI, it will not automatically deploy and errors can be inspected in the GitHub Actions part of the HuskySwap repo.
