//in this file all of methods are written as par documentation so go through with addwrite docs

import { Client, ID, Databases, Storage, Query } from "appwrite";
import conf from "../Config/config";

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appWriteUrl)
      .setProject(conf.appWriteProjectId);

    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({ title, slug, content, featuredImage, status, userId }) {
    try {
      return await this.databases.createDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug, //as a document id
        {
          title,
          content,
          featuredImage,
          status,
          userId,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
    }
  }

  async updatePost(slug, { title, content, featuredImage, status }) {
    //ama slug ne pela as a argument rakhyu che km k post ne update karva aek time ae aek j post joiye so aeni id madvi joiye jene apde slug thi identify karsu

    try {
      return await this.databases.updateDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug,
        {
          title,
          content,
          featuredImage,
          status,
        }
      );
    } catch (error) {
      console.log("Appwrite service :: updatePost :: error", error);
    }
  }

  async deletePost(slug) {
    try {
      await this.databases.deleteDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug
      );
      return true; //if post deleted then return true
    } catch (error) {
      console.log("Appwrite service :: deletePost :: error", error);
      return false; //if post not deleted then return false
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        slug
      );
    } catch (error) {
      console.log("Appwrite service :: getPost :: error", error);
      return false;
    }
  }

  //je post active hoi ae badhi ne get karva mate apde query no use karvo pade and query no use karta hoi to apde appwrite ni andar index banavelo hovo joiye baki ano use na kari sakiye...jo apde query no use na kariye and normal rite getposts no code lakhiye to active no hoi te b avi jai so query no use karvo pade

  async getPosts(queries = [Query.equal("status", "active")]) {
    try {
      return await this.databases.listDocuments(
        conf.appWriteDatabaseId,
        conf.appWriteCollectionId,
        queries
      );
    } catch (error) {
      console.log("Appwrite service :: getPosts :: error", error);
      return false;
    }
  }

  //file upload service

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appWriteBucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.log("Appwrite service :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appWriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log("Appwrite service :: deleteFile :: error", error);
      return false;
    }
  }

  getFilePreview(fileId) {
    return this.bucket.getFilePreview(conf.appWriteBucketId, fileId);
  }
}

const service = new Service();
export default service;
