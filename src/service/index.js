import { CandidateService } from "./candidate-services";
import { ClientServices } from "./client-services";
import { MasterServices } from "./master-service";
import { AuthorizationService } from "./user-service";

const serviceUrl = window.SERVICE_URL || "/";
const apiPath = "authapi/v1";
const apiPathCa = "candidatesapi/v1";
const apiPathClient = "authapi/v1/client";
const apimaster = "authapi/v1/masters";

export const authorizationService = new AuthorizationService(`${serviceUrl + apiPath}`);
export const candidateService = new CandidateService(`${serviceUrl + apiPathCa}`);
export const ClientService = new ClientServices(`${serviceUrl + apiPathClient}`);
export const masterService = new MasterServices(`${serviceUrl + apimaster}`);
