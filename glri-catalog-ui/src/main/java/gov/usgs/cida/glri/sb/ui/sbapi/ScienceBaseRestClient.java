package gov.usgs.cida.glri.sb.ui.sbapi;

import java.io.BufferedReader;
import java.io.Closeable;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpEntityEnclosingRequestBase;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpPut;
import org.apache.http.client.methods.HttpRequestBase;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.cookie.Cookie;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.protocol.HTTP;
import org.json.JSONException;
import org.json.JSONObject;

import gov.usgs.cida.glri.sb.ui.AppConfig;

public class ScienceBaseRestClient implements Closeable {
	
	private static final Logger log = Logger.getLogger(ScienceBaseRestClient.class.getName());
	
	public static final String JOSSO_PATH = "/josso/signon/usernamePasswordLogin.do";
	public static final String JOSSO_LOGIN= "login";
	public static final String JOSSO_CMD  = "josso_cmd";
	public static final String JOSSO_VAL  = "josso";
	public static final String JOSSO_USR  = "josso_username";
	public static final String JOSSO_PWD  = "josso_password";
	public static final String JOSSO_SID  = "JOSSO_SESSIONID";
	
	public static final String CONTENT_JSON = "application/json";
	
	private static final String HTTP_STATUS_CODE = "httpStatusCode";	//JSON key for the status code of an http response
	
//
//    public static final String ENV_PROD = "prod";
//    public static final String ENV_BETA = "beta";
//
//    public static final String JOSSO_URL_PROD = "https://my.usgs.gov";
//    public static final String JOSSO_URL_BETA = "https://my-beta.usgs.gov";
//
//    public static final String BASE_URL_PROD = "www.sciencebase.gov";
//    public static final String BASE_URL_BETA = "beta.sciencebase.gov";

    public static final String ITEM_PATH  = "/catalog/item/";
    public static final String ITEMS_PATH = "/catalog/items/";

    private CloseableHttpClient httpClient;
    private HttpClientContext context;
    private String jossoId;


    public ScienceBaseRestClient() {
        httpClient = HttpClients.createDefault();
        context    = HttpClientContext.create();
    }
    /**
     *  Login to ScienceBase and return a HttpClient
     *
     * @param username  The plain text username to authenticate on, use your own or a service account
     * @param password  The plain text password to authenticate on
     * @return          The josso_sessionid from the cookie received when logging in
     * @throws IOException connection error
     */
    public String login(String username, String password) throws IOException {
        jossoId = null;

        try {
	        List<NameValuePair> params = new ArrayList<>();
	        params.add(new BasicNameValuePair(JOSSO_CMD, JOSSO_VAL));
	        params.add(new BasicNameValuePair(JOSSO_USR, username));
	        params.add(new BasicNameValuePair(JOSSO_PWD, password));
	        
        	URI loginUrl = buildLoginUrl();
	        HttpPost httpPost = new HttpPost(loginUrl);
	        httpPost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
	        httpPost.addHeader("Accept", CONTENT_JSON);
	
	        httpClient.execute(httpPost, context);
	
	        for (Cookie cookie: context.getCookieStore().getCookies()) {
	            if (JOSSO_SID.equals(cookie.getName())) {
	                jossoId = cookie.getValue();
	            }
	        }
        } catch (Exception e) {
        	log.log(Level.WARNING, "failed to log into ScienceBase as user " + username, e);
        }
        
        return jossoId;
    }
	
	/**
	 * Directly set the jssoToken.
	 * This is used if the login has taken place separately.
	 * @param jssoToken 
	 */
	public void setJssoToken(String jssoToken) {
		jossoId = jssoToken;
	}

    
	@Override
    public void close() {
        try {
            httpClient.close();
        } catch (IOException e) {
        	log.log(Level.INFO, "Failed to close ScienceBase http clent", e);
        }
    }

    public JSONObject getSbItem(String itemId) throws IOException{
        return jsonGet(buildSbUri(ITEM_PATH + itemId));
    }

    public JSONObject updateSbItem(String itemId, JSONObject itemJson) throws IOException {
        return jsonPut(buildSbUri(ITEM_PATH + itemId), itemJson);
    }

    public JSONObject createSbItem(JSONObject itemJson) throws IOException {
        return jsonPost(buildSbUri(ITEM_PATH), itemJson);
    }

    public JSONObject findSbItems(JSONObject params) throws IOException {
        return jsonGet(buildSbUri(ITEMS_PATH, params));
    }
    
    
    protected URI buildLoginUrl() {
        try {
            URIBuilder uriBuilder = new URIBuilder()
                    .setScheme("https")
                    .setHost(AppConfig.get(AppConfig.SCIENCEBASE_AUTH))
                    .setPath(JOSSO_PATH);


            return uriBuilder.build();
        } catch (URISyntaxException e) {
        	log.log(Level.WARNING, "While building ScienceBase URI: " + JOSSO_PATH, e);
            return null;
        }
    }

    protected URI buildSbUri(String path) {
        return buildSbUri(path, null);
    }

    protected URI buildSbUri(String path, JSONObject params) {
        try {
            URIBuilder uriBuilder = new URIBuilder()
                    .setScheme("https")
                    .setHost(AppConfig.get(AppConfig.SCIENCEBASE_HOST))
                    .setPath(path)
                    .setParameter(JOSSO_VAL, jossoId)
                    .setParameter("appName", "javasb");

            if (params != null) {
                for (String key : params.keySet()) {
                    uriBuilder.setParameter(key, params.getString(key));
                }
            }

            return uriBuilder.build();
        } catch (URISyntaxException e) {
        	log.log(Level.WARNING, "While building ScienceBase URI: " + path, e);
            return null;
        }
    }

	protected void config(JSONObject params, HttpEntityEnclosingRequestBase  http) throws UnsupportedEncodingException {
		http.setEntity(new StringEntity(params.toString()));
        http.setHeader(HTTP.CONTENT_TYPE, CONTENT_JSON);
	}    
    
    protected JSONObject jsonGet(URI uri) throws IOException {
        HttpGet httpGet = new HttpGet(uri);
        return jsonRequest(httpGet);
    }

    protected JSONObject jsonPost(URI uri, JSONObject params) throws IOException {
        HttpPost httpPost = new HttpPost(uri);
        config(params, httpPost);
        return jsonRequest(httpPost);
    }

    protected JSONObject jsonPut(URI uri, JSONObject params) throws IOException {
        HttpPut httpPut = new HttpPut(uri);
        config(params, httpPut);
        return jsonRequest(httpPut);
    }

    protected JSONObject jsonRequest(HttpRequestBase request) throws IOException {
        request.addHeader("Accept", CONTENT_JSON);
        StringBuilder responseStrBuilder = new StringBuilder();
		int statusCode;
        
        try (CloseableHttpResponse response = httpClient.execute(request, context)) {
			statusCode = response.getStatusLine().getStatusCode();
			
	        InputStream in = response.getEntity().getContent();
	        String readLine;
	        BufferedReader br = new BufferedReader(new InputStreamReader(in));
	        while ((readLine = br.readLine()) != null) {
	            responseStrBuilder.append(readLine);
	        }
        }

        try {
			JSONObject json = new JSONObject(responseStrBuilder.toString());
			json.put(HTTP_STATUS_CODE, statusCode);
            return json;
        } catch (JSONException jsonException) {
            return new JSONObject().put("error", "error building json from request, full response in errorHTML")
                    .put("errorHTML", responseStrBuilder.toString())
					.put(HTTP_STATUS_CODE, statusCode);
        }
    }

}
