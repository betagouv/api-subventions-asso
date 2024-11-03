import { CliStaticInterface } from "../../@types";
import { StaticImplements } from "../../decorators/staticImplements.decorator";
import CliController from "../../shared/CliController";
import sireneService from "../../modules/providers/sirene/sirene.service";
import path from "path";
import { SireneParser } from "../../modules/providers/sirene/sirene.parser";
import sirenePort from "../../dataProviders/db/SIRENE/sirene.port";
import SireneAdapter from "../../dataProviders/db/SIRENE/sirene.adapter";
import {transferData} from "../../dataProviders/db/SIRENE/sirene.transfer";
import { joinCollection } from "../../dataProviders/db/associationFlat/associationFlatMongo";
import { joinCollectionPostgres } from "../../dataProviders/db/associationFlat/associationFlatPostgres";
import { start } from "repl";
const DIRECTORY_PATH = '/home/gcarra/data_subvention/api-subventions-asso/packages/api/src/modules/providers/sirene';
@StaticImplements<CliStaticInterface>()
export default class PocCli extends CliController {
    static cmdName = "poc";


    public async test() {
      console.log('unzip');
      
      const start_postgres = performance.now(); 
      console.log(start_postgres);
      
      const result_postgres = await joinCollectionPostgres();
      const end_postgres = performance.now();
      const executionTime_postgres = end_postgres - start_postgres;
      console.log(`Execution Time: ${executionTime_postgres.toFixed(2)} milliseconds`);
  //      await sireneService.saveZip("poc-zip");
        //const result = await SireneParser.parseWithDuckDb(path.join(DIRECTORY_PATH, "StockUniteLegale_utf8.csv"));
      
        const start = performance.now();
        const result = await joinCollection();
        const end = performance.now();
        const executionTime = end - start;
       // console.log('Execution time: ', end - start);
        console.log(`Execution Time: ${executionTime.toFixed(2)} milliseconds`);

      
        
       // await transferData();
    //    const result = await SireneParser.parseCsv(path.join(DIRECTORY_PATH, "StockUniteLegale_utf8.csv"));
     //   await sirenePort.insertMany(result.map(SireneAdapter.toDbo));
    //   await sireneService.unzip("poc-zipp2mYyapoc-zip.zip", "d");
    }
}



