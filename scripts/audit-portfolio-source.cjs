// Read-only inventory; no customer data, credentials or database writes.
const { PrismaClient } = require('../artifacts/kuhni-na-zakaz/node_modules/@prisma/client');
const db = new PrismaClient();
db.portfolioCase.findMany({where:{published:true},orderBy:{slug:'asc'},select:{
  slug:true,externalId:true,title:true,shortTitle:true,city:true,cityKey:true,region:true,district:true,
  priceFrom:true,priceTo:true,priceNote:true,workDuration:true,mainImage:true,color:true,
}}).then(rows => process.stdout.write(JSON.stringify(rows,null,2)))
  .finally(() => db.$disconnect());
