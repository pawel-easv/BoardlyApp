#!/bin/bash
set -a
source .env
set +a


dotnet ef dbcontext scaffold "Host=ep-tiny-surf-ag2tryb9-pooler.c-2.eu-central-1.aws.neon.tech; Database=neondb; Username=neondb_owner; Password=npg_6tCjzhxA5ODa; SSL Mode=VerifyFull; Channel Binding=Require;" Npgsql.EntityFrameworkCore.PostgreSQL   --context MyDbContext     --no-onconfiguring        --schema boardly   --force
