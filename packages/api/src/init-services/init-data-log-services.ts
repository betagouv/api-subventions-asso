import { DataLogService } from "../modules/data-log/dataLog.service";
import dataLogAdapter from "../dataProviders/db/data-log/data-log.adapter";

export const dataLogService = new DataLogService(dataLogAdapter);
