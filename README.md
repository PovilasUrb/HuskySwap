# HuskySwap

[CLICK HERE >> HuskySwap Website <<](https://husky-swap.azurewebsites.net/)

[Project Documentation/Proposal](https://docs.google.com/document/d/1b-036ETsawjpZUHPB2AdQ41adTJuzHHXcQ2e1PDJsd4/edit?usp=sharing)

[Demo Presentation Slides](https://docs.google.com/presentation/d/117dGuEK98-TwAPGUBijfTXKM1hCZNRdOGHY__NDKyi0/edit?usp=sharing)

[Developer Documentation](https://github.com/JDKaim/HuskySwap/blob/main/DEVELOPER_DOCUMENTATION.md)

## **Setting Up and Running Source Code**

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

* You must run **both** Frontend and Backend based on the instruction above to host a local server!

----------------------------------------------------------------------------------

## **Testing**

To test the **BACKEND**, you must:

Navigate to the src directory:

    cd src

Restore .NET Core dependencies

    dotnet restore

Run testing

    dotnet test

Tests can be added in LightNap.Core.Tests. Tests should be put in a new folder under LightNap.Core.Tests if they don't fall under a preexisting folder's category.

There are no naming conventions for new tests, if they are under the folder please name them with sanity. Standard .NET testing structures should be used, and one can model existing tests to do so.

To test the **FRONTEND**, you must:

Navigate to the lightnap-ng directory in a different terminal

    cd src/lightnap-ng

Install Angular dependencies

    npm install

Run tests

    npm test

Tests can be added in lightnap-ng in the same folders as the code that they intend to test. The files should be given the same name as the file they desire to test, however the suffix must be changed from .ts to .spec.ts. Tests use Jasmine and Karma for Angular, and one can model existing tests to do so.

----------------------------------------------------------------------------------

## **Building**

When a commit is merged to the main branch, it will automatically kick off a completely automated CI/CD pipeline that will build the project and deploy it to https://husky-swap.azurewebsites.net.
