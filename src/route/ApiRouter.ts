import ApiController from "../controllers/ApiController";
import { ApiService } from "../services/ApiService";
import { Request, Response } from "express";

export class ApiRouter {
  private router: any;
  private endpoint: string;
  private authorization?: any;
  private schemaInstance: any;
  private apiService: any;
  private apiController: any;

  constructor(
    router: any,
    endpoint: string,
    schemaInstance: any,
    authorization?: any
  ) {
    this.router = router;
    this.endpoint = endpoint;
    this.schemaInstance = schemaInstance;
    this.authorization = authorization;
    this.apiService = new ApiService(this.endpoint, this.schemaInstance);
    this.apiController = new ApiController(this.apiService);

    if (authorization) {
      this.PrivateRoutes();
    } else {
      this.publicRoutes();
    }
  }

  private publicRoutes() {
    this.router.post(`/${this.endpoint}`, (req: Request, res: Response) =>
      this.apiController.create(req, res)
    );
    this.router.get(`/${this.endpoint}`, (req: Request, res: Response) =>
      this.apiController.read(req, res)
    );
    this.router.put(`/${this.endpoint}/:id`, (req: Request, res: Response) =>
      this.apiController.update(req, res)
    );
    this.router.delete(`/${this.endpoint}/:id`, (req: Request, res: Response) =>
      this.apiController.delete(req, res)
    );
    // this.router.put("/records/update", (req: Request, res: Response) =>
    //   this.apiController.updateManyTitles(req, res)
    // );
  }

  private PrivateRoutes() {
    this.router.post(
      `/${this.endpoint}`,
      this.authorization,
      (req: Request, res: Response) => this.apiController.create(req, res)
    );
    this.router.get(
      `/${this.endpoint}`,
      this.authorization,
      (req: Request, res: Response) => this.apiController.read(req, res)
    );
    this.router.put(
      `/${this.endpoint}/:id`,
      this.authorization,
      (req: Request, res: Response) => this.apiController.update(req, res)
    );
    this.router.delete(
      `/${this.endpoint}/:id`,
      this.authorization,
      (req: Request, res: Response) => this.apiController.delete(req, res)
    );
    this.router.put(
      "/records/update",
      this.authorization,
      (req: Request, res: Response) =>
        this.apiController.updateManyTitles(req, res)
    );

    this.router.get(
      `/record/:id`,
      this.authorization,
      (req: Request, res: Response) => this.apiController.read(req, res)
    );
  }
}
