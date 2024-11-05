//this authentication file is usefull for every project
//in this file all of methods are written as par documentation so go through with addwrite docs

import { Client, Account, ID } from "appwrite";
import conf from "../Config/config";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);
    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
    try {
      const userAccount = await this.account.create(
        ID.unique(),
        email,
        password,
        name
      );

      if (userAccount) {
        //call another method
        return this.login({ email, password }); //after creation of acc ,user will forcefully redirect to the login page
      } else {
        return userAccount;
      }
    } catch (error) {
      console.log("Appwrite service :: createAccount :: error", error);
    }
  }

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.log("Appwrite service :: login :: error", error);
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error", error);
    }
  }

  async logout() {
    try {
      return await this.account.deleteSessions(); //all sessions of user will be deleted
    } catch (error) {
      console.log("Appwrite service :: logout :: error", error);
    }
  }
}

const authService = new AuthService();

export default authService;
