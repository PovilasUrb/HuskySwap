# -----------------------------------------------
#  STEP 1: Use .NET 8.0 Preview SDK to Build
# -----------------------------------------------
    FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
    WORKDIR /app
    
    # (1) Copy the entire source code into /app
    COPY ./src/ ./
    
    # (2) Restore .NET packages
    RUN dotnet restore LightNap.sln
    
    # (3) We need Node.js to build Angular. Let's install Node 18:
    RUN apt-get update && apt-get install -y curl \
        && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
        && apt-get install -y nodejs \
        && apt-get clean -y && rm -rf /var/lib/apt/lists/*
    
    # (4) Build the Angular frontend (lightnap-ng)
    WORKDIR /app/lightnap-ng
    RUN npm install
    
    # 
    # If your angular.json is set to output to dist/lightnap-ng:
    # RUN npm run build
    #
    # OR if your angular.json outputs directly to ../LightNap.WebApi/wwwroot:
    # RUN npm run build
    # (No extra copy step needed)
    #
    
    RUN npm run build
    
    # (5) Publish .NET backend
    WORKDIR /app
    RUN dotnet publish LightNap.WebApi/LightNap.WebApi.csproj -c Release -o out
    
    # -----------------------------------------------
    # STEP 2: Runtime Image (ASP.NET Core 8.0 Preview)
    # -----------------------------------------------
    FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
    WORKDIR /app
    
    # (6) Copy the published .NET files
    COPY --from=build /app/out ./
    
    # (7) If your Angular build actually lands in dist/lightnap-ng,
    #     copy that to wwwroot:
    # COPY --from=build /app/lightnap-ng/dist/lightnap-ng/ ./wwwroot/
    
    # If, instead, your angular.json's outputPath is ../LightNap.WebApi/wwwroot,
    # then your Angular files are already in /app/out/wwwroot from the publish step,
    # so you may not need any extra copy here.
    
    # Expose port 80 and set environment variable
    EXPOSE 80
    ENV ASPNETCORE_URLS=http://+:80
    
    # Run the app
    ENTRYPOINT ["dotnet", "LightNap.WebApi.dll"]
    