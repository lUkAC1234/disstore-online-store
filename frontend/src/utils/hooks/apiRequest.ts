import i18next from "i18next";
import ProjectConfig from "../../../project.config.json";

abstract class ApiRequest {
  private static origin: string = ProjectConfig.origin + "/lang/api";

  public static async makeRequest<T>(apiEndpoint: string): Promise<T> {
    try {
      const urlGenerated: string = this.origin.replace("lang", i18next.language);
      let finalURL: string;

      if (apiEndpoint.at(0) === "/") finalURL = urlGenerated + apiEndpoint;
      else finalURL = urlGenerated + "/" + apiEndpoint;

      const response: Response = await fetch(finalURL);

      if (!response.ok) {
        throw new Error(`Failed to fetch api request!\nSTATUS_CODE: ${response.status}`);
      }

      const data: T = await response.json();
      return data;
    } catch (err) {
      console.error(err);
    }
  }
}

export default ApiRequest;
