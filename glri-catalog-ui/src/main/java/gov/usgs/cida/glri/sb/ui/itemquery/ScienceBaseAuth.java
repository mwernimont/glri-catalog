package gov.usgs.cida.glri.sb.ui.itemquery;

import java.io.IOException;
import java.util.ArrayList;

import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.client.BasicCookieStore;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;


/**
 * Connects to the myUSGS josso AD authentication server and returns a session ID
 * 
 * @author duselmann
 */
public class ScienceBaseAuth {
	
	public final String JOSSO_HOST = "my.usgs.gov";
	public final String JOSSO_PATH = "/josso/signon/usernamePasswordLogin.do";
	public final String JOSSO_VAL  = "josso";
	public final String JOSSO_CMD  = "josso_cmd";
	public final String JOSSO_USR  = "josso_username";
	public final String JOSSO_PWD  = "josso_password";
	
	
	/**
	 * Connects to my.usgs.gov to obtain a token for sciencebase.gov CRUD actions.
	 * @param username
	 * @param password
	 * @return JOSSO SESSION ID on authentication or empty string
	 * @throws IOException only if there is an issue connecting to the authentication service.
	 */
	public String authenticate(String username, String password) throws IOException {
		URIBuilder uriBuild = new URIBuilder();
		uriBuild.setScheme("https");
		uriBuild.setHost(JOSSO_HOST);
		uriBuild.setPath(JOSSO_PATH);

		ArrayList<NameValuePair> postParameters = new ArrayList<NameValuePair>();
		postParameters.add(new BasicNameValuePair(JOSSO_CMD, JOSSO_VAL));
		postParameters.add(new BasicNameValuePair(JOSSO_USR, username));
		postParameters.add(new BasicNameValuePair(JOSSO_PWD, password));

		BasicCookieStore cookieStore = new BasicCookieStore();
		
		HttpPost httpPost = null;
		try {
			httpPost = new HttpPost(uriBuild.build());
		} catch (Exception e) {
			throw new IOException("Error building URI",e);
		}
		httpPost.setEntity(new UrlEncodedFormEntity(postParameters));		

		CloseableHttpClient httpclient = HttpClients.custom()
	                .setDefaultCookieStore(cookieStore)
	                .build();
		
		try (CloseableHttpResponse response = httpclient.execute(httpPost)) {
			
			String authToken = "";
			for (Cookie cookie :cookieStore.getCookies() ) {
				if ( "JOSSO_SESSIONID".equalsIgnoreCase( cookie.getName() ) ) {
					authToken = cookie.getValue();
					break;
				}
			}
			return authToken;
		}
	}
	
	/**
	 * used to test the authentication method within this class.
	 * during testing the username and password where valid.
	 * and it returned a josso session id alphanumeric token
	 * 
	 * @param args expecting "username password" params
	 * @throws Exception throws IOE if cannot connect properly
	 */
	public static void main(String[] args) throws Exception {
		
		String username = "replaceWithEmailAddr@usgs.gov";
		String password = "replaceWithPassword";
		
		if (args.length == 2) {
			username = args[0];
			password = args[1];
		} else {
		}
		ScienceBaseAuth auth = new ScienceBaseAuth();
		System.out.println( auth.authenticate(username, password) );
	}
}
