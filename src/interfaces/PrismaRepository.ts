import { prismaClient } from "../prisma";
import { ApiService } from "../services/ApiService";

// Interfaces
interface dataRepository {
  create(userId: string, data: any): Promise<any>;
  read(userId: string): Promise<any[]>;
  update(dataId: string, userId: string, data: any): Promise<any>;
  delete(dataId: string, userId: string): Promise<number>;
  updateMany(currentName: string, updateName: string): Promise<any>;
}

interface AuthService {
  decodeToken(token: string): { userId: string } | null;
}

export class Repository implements dataRepository {
  private _schema: any;
  constructor(_schema: any) {
    _schema = this._schema;
  }

  async create(userId: string, data: any) {
    return this._schema.create({
      data: { ...data, userId },
    });
  }

  async read(userId: string) {
    return this._schema.findMany({
      where: { userId },
    });
  }

  async update(dataId: string, userId: string, data: any) {
    return this._schema.update({
      where: { id: dataId, userId },
      data: { ...data },
    });
  }

  async delete(dataId: string, userId: string) {
    return this._schema.delete({
      where: { id: dataId, userId },
    });
  }

  async updateMany(currentName: string, updateName: string) {
    return this._schema.updateMany({
      where: { category: currentName.toUpperCase().trim() },
      data: { category: updateName.toUpperCase().trim() },
    });
  }
}

// class JWTAuthService implements AuthService {
//   decodeToken(token: string) {
//     // Implementação para decodificar token JWT
//     try {
//       // Exemplo simplificado para demonstração
//       const decoded = decodeToken(token);
//       return decoded ? { userId: decoded.userId } : null;
//     } catch (error) {
//       console.error("Error decoding token:", error);
//       return null;
//     }
//   }
// }
