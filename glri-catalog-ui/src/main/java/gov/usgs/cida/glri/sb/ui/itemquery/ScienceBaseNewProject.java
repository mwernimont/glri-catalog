package gov.usgs.cida.glri.sb.ui.itemquery;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Map;

import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import gov.usgs.cida.glri.sb.ui.AppConfig;


/**
 * POSTs new project data to sciencebase.gov
 * 
 * @author duselmann
 */
public class ScienceBaseNewProject {
	
	public final String JOSSO_HOST = "my.sciencebase.gov";
	public final String JOSSO_VAL  = "josso";
	
	
	/**
	 * POSTs new projects to sciencebase.
	 * @param token the user auth token
	 * @param newProjectJson the json project string
	 * @return the new project id or empty string
	 * @throws IOException only if there is an issue connecting to the authentication service.
	 */
	public String post(AppConfig config, String token, String newProjectJson) throws IOException {
		HttpPost httpPost = createPost(token, newProjectJson);		

		CloseableHttpClient httpclient = HttpClients.createDefault();
		
		try (CloseableHttpResponse response = httpclient.execute(httpPost)) {
			
			checkHttpStatusCode(response);
			
			HttpEntity respBody = response.getEntity();
			String id = parseNewProjectId(respBody);
			
			cleanup(respBody, id);
			
			return id;
		}
		
	}

	/**
	 * consumes the http entity and only returns an error, that might have occurred,
	 * if there is no id found.
	 * 
	 * Package access for testing
	 * 
	 * @param respBody the entity to consume
	 * @param id the value possibly parsed from the entity
	 * @throws IOException thown only if there is an error and the id is not found
	 */
	void cleanup(HttpEntity respBody, String id) throws IOException {
		try {
			EntityUtils.consume(respBody);
		} catch (Exception e) {
			if (null == id || "".equals(id)) {
				throw new IOException("failed to consume and close response", e);
			}
		}
	}

	/**
	 * converts the entity content into a JSON map and looks for the new project id.
	 * returns the empty string if no id is found
	 * 
	 * Package access for testing
	 * 
	 * @param respBody the entity that should contain the JSON with a new project ID
	 * @return new project ID or the empty string
	 * @throws IOException
	 */
	String parseNewProjectId(HttpEntity respBody) throws IOException {
		String respJson  = EntityUtils.toString(respBody);
		
		String id = "";
		try {
			Map<?,?> jsonMap = jsonToMap(respJson);
			id = (String)jsonMap.get("id");
		} catch (ParseException e) {
			throw new IOException("invalid JSON response", e);
		}
		return id;
	}

	/**
	 * Throws an exception if the status is not 200
	 * 
	 * @param response
	 * @throws IOException
	 */
	void checkHttpStatusCode(CloseableHttpResponse response) throws IOException {
		int statusCode = response.getStatusLine().getStatusCode();
		if (200 != statusCode) {
			throw new IOException("failed to post new project: status code " + statusCode);
		}
	}

	/**
	 * constructs a POST call to the app config science base host for a new project
	 * @param token the user auth token
	 * @param newProjectJson the new project JSON string
	 * @return an HttpPost object for the given new project
	 * @throws IOException
	 */
	HttpPost createPost(String token, String newProjectJson) throws IOException {
		URIBuilder uriBuild = new URIBuilder();
		uriBuild.setScheme("https");
		uriBuild.setHost(AppConfig.get(AppConfig.SCIENCEBASE_HOST));
		uriBuild.setPath("/catalog/item");

		ArrayList<NameValuePair> postParameters = new ArrayList<NameValuePair>();
		postParameters.add(new BasicNameValuePair(JOSSO_VAL, token));
		
		HttpPost httpPost = null;
		try {
			httpPost = new HttpPost(uriBuild.build());
			HttpEntity reqBody = new ByteArrayEntity(newProjectJson.getBytes("UTF-8"));
			httpPost.setEntity(reqBody);
	    } catch (Exception e) {
			throw new IOException("Error building URI", e);
		}
		httpPost.setEntity(new UrlEncodedFormEntity(postParameters));
		return httpPost;
	}
	
	/**
	 * Converts a JSON string to a map
	 * @param json
	 * @return
	 * @throws ParseException
	 */
	public static Map<?,?> jsonToMap(String json) throws ParseException {
    	JSONParser j = new JSONParser();
    	JSONObject o = (JSONObject)j.parse(json);
    	Map<?,?> jsonMap = (Map<?,?>)o.get("response");
        return jsonMap;
	}
	
	
//	public static Map<?,?> streamToJson(InputStream json) throws IOException, ParseException {
//		 BufferedReader rd = new BufferedReader(new InputStreamReader(json));
//        String line = "";
//        while ((line = rd.readLine()) != null) {
//           //Parse our JSON response               
//           JSONParser j = new JSONParser();
//           JSONObject o = (JSONObject)j.parse(line);
//           Map response = (Map)o.get("response");
//        }
//        return 
//   }
	
	
	/**
	 * used to test the authentication method within this class.
	 * during testing the username and password where valid.
	 * and it returned a josso session id alphanumeric token
	 * 
	 * @param args expecting "username password" params
	 * @throws Exception throws IOE if cannot connect properly
	 */
	public static void main(String[] args) throws Exception {
//		
//		String username = "replaceWithEmailAddr@usgs.gov";
//		String password = "replaceWithPassword";
//		
//		if (args.length == 2) {
//			username = args[0];
//			password = args[1];
//		} else {
//		}
//		ScienceBaseNewProject auth = new ScienceBaseNewProject();
//		System.out.println( auth.authenticate(username, password) );
	}
}
