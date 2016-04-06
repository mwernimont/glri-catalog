package gov.usgs.owi.javasinglesignon;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;
import javax.security.auth.Subject;
import javax.security.auth.callback.Callback;
import javax.security.auth.callback.CallbackHandler;
import javax.security.auth.callback.NameCallback;
import javax.security.auth.callback.PasswordCallback;
import javax.security.auth.login.LoginException;
import javax.security.auth.spi.LoginModule;
import org.apache.http.NameValuePair;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.protocol.HttpClientContext;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.cookie.Cookie;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;

/**
 * A LoginModule that can be used with any J2EE container (i.e. Tomcat).
 * 
 * This module is intended to use the user's credentials to login to a remote
 * authentication server that hosts single sign-on authentication.  That remote
 * server should return a jsso token that proves authentication to other servers
 * participating in the jsso realm.
 * 
 * The jsso token is then available as part of the user's Principal (a
 * RemoteSingleSignonPrincipal) for use on the user's behalf for service operations
 * to other servers w/in the jsso realm.
 * 
 * LoginModules are part of the Java JAAS spec.  Basic usage and configuration
 * of JAAS is described here:
 * https://docs.oracle.com/javase/8/docs/technotes/guides/security/jgss/tutorials/LoginConfigFile.html
 * 
 * Using JAAS with Tomcat is documented here:
 * https://tomcat.apache.org/tomcat-8.0-doc/realm-howto.html#JAASRealm
 * 
 * A few good examples:
 * http://www.byteslounge.com/tutorials/jaas-authentication-in-tomcat-example
 * http://www.javaranch.com/journal/2008/04/authentication-using-JAAS.html
 * 
 * Configuration is done via a jaas.config file, which much be specified to
 * the JVM on startup as:
 * -Djava.security.auth.login.config=/path/to/jaas.config
 * 
 * Here is a sample config file, which includes all the defaults that are
 * already present in the class:
 * <pre>
 * RemoteSingleSignonLoginModule {
 *    gov.usgs.owi.javasinglesignon.RemoteSingleSignonLoginModule required debug=true remoteRole=ad-user remoteScheme=https remoteHost=my.usgs.gov remotePath=/josso/signon/usernamePasswordLogin.do;
 * };
 * </pre>
 * Note that no role is provided by the remote server, so a role must be assigned
 * explicitly (ad-user by default).
 * 
 * The context.xml needs to have the realm added, eg:
 * <pre>
 * <Context>
 *   <Realm className="org.apache.catalina.realm.LockOutRealm">
 *     <!-- Nested realms in 'lockout' prevents 'too many' attempts.  Children are tried in order.  -->
 *     <!-- UserDatabaseRealm allows std tomcat file logins for manager operations -->
 *     <Realm className="org.apache.catalina.realm.UserDatabaseRealm" resourceName="UserDatabase"/>
 * 
 *     <Realm className="org.apache.catalina.realm.JAASRealm" 
 *     appName="RemoteSingleSignonLoginModule"
 *     userClassNames="gov.usgs.owi.javasinglesignon.RemoteSingleSignonPrincipal"
 *     roleClassNames="gov.usgs.owi.javasinglesignon.RemoteSingleSignonRole" />
 *   </Realm>
 * </Context>
 * </pre>
 * 
 * @author eeverman
 */
public class RemoteSingleSignonLoginModule implements LoginModule {
	public static final Logger log = Logger.getLogger(RemoteSingleSignonLoginModule.class.getCanonicalName());
	
	private static final String JOSSO_CMD  = "josso_cmd";
	private static final String JOSSO_VAL  = "josso";
	private static final String JOSSO_USR  = "josso_username";
	private static final String JOSSO_PWD  = "josso_password";
	private static final String JOSSO_SID  = "JOSSO_SESSIONID";
	public static final String CONTENT_JSON = "application/json";
	
	
	//Config param names that can be configured in the jaas.config file
	private static final String JAAS_PARAM_REMOTE_ROLE = "remoteRole";
	private static final String JAAS_PARAM_REMOTE_SCHEME = "remoteScheme";
	private static final String JAAS_PARAM_REMOTE_HOST = "remoteServer";
	private static final String JAAS_PARAM_REMOTE_PATH = "remotePath";
	
	//Default values that can be configured in jaas.config
	private static final String DEFAULT_ROLE = "ad-user";
	private static final String DEFAULT_REMOTE_SCHEME = "https";
	private static final String DEFAULT_REMOTE_HOST = "my.usgs.gov";
	private static final String DEFAULT_REMOTE_PATH = "/josso/signon/usernamePasswordLogin.do";
	
	//Standard API State
	private Subject subject;
	private CallbackHandler callbackHandler;
	private Map<String, ?> sharedState;
	private Map<String, ?> options;
	
	//Custom state
	private boolean isLoggedIn;	//if true, the user's name and password succeeded in loging in
	private boolean isCommitted;	//If true, consider the user to be logged here.
	RemoteSingleSignonPrincipal principal;	//The principal.  Keep so we know which principal to remove during logout.
	ArrayList<RemoteSingleSignonRole> roles;	//Role for the pricipal.  Keep so we know what to remove from the subject.
	private String name;				//user login name
	private transient char[] pwd;		//user login pwd (only kept from login to commit)
		
		
	@Override
	public void initialize(Subject subject, CallbackHandler callbackHandler, Map<String, ?> sharedState, Map<String, ?> options) {
		this.subject = subject;
		this.callbackHandler = callbackHandler;
		this.sharedState = sharedState;
		this.options = options;
	}

	@Override
	public synchronized boolean login() throws LoginException {
		NameCallback nameCb = new NameCallback("Enter yer name");
		PasswordCallback pwdCb = new PasswordCallback("Enter yer pwd", false);
		
		try {
			callbackHandler.handle(new Callback[] {nameCb, pwdCb});
			
			name = nameCb.getName();
			pwd = pwdCb.getPassword();
			
			
			if (name != null && name.length() > 0 && pwd != null && pwd.length > 0) {
				
				String jsson = doSingleSignonLogin(name, pwd);
				
				if (jsson != null) {
					principal = new RemoteSingleSignonPrincipal(name, jsson);
					roles = new ArrayList<RemoteSingleSignonRole>();
					roles.add(new RemoteSingleSignonRole(getOption(JAAS_PARAM_REMOTE_ROLE, DEFAULT_ROLE)));

					isLoggedIn = true;

					log.finest("Login successful");
					return true;
				} else {
					return false;
				}

			} else {
				log.finest("Login failed");
				throw new LoginException("No user name or password supplied");
			}
		} catch (Exception ex) {
			log.severe("Unexpected exception during login" +  ex.getMessage());
			throw new LoginException(ex.getLocalizedMessage());
		}
	}

	@Override
	public synchronized boolean commit() throws LoginException {
		if (isLoggedIn) {
			isCommitted = true;
			
			subject.getPrincipals().add(principal);
			subject.getPrincipals().addAll(roles);

			destroySecrets();
			
		} else {
			destroyAllState();
		}
		
		return isCommitted;
	}

	@Override
	public synchronized boolean abort() throws LoginException {
		destroyAllState();
		return true;
	}

	@Override
	public synchronized boolean logout() throws LoginException {
		destroyAllState();
		return true;
	}
	
	private void destroyAllState() {
		
		tryLogout();
		
		destroySecrets();
		subject = null;
		callbackHandler = null;
		sharedState = null;
		options = null;
		principal = null;
		roles = null;
		
		isLoggedIn = false;
		isCommitted = false;
	}
	
	private void destroySecrets() {
		pwd = null;
	}
	
	private void tryLogout() {
		if (subject != null && !subject.isReadOnly() && subject.getPrincipals() != null && principal != null) {
			
			//There may be other principals and roles in the subject, so leave other alone
			if (principal != null) {
				subject.getPrincipals().remove(principal);
			}
			if (roles != null) {
				subject.getPrincipals().removeAll(roles);
			}
		}
		
		principal = null;
		roles = null;
	}
	
    /**
     *  Login to ScienceBase and return a HttpClient
     *
     * @param name  The plain text username to authenticate on, use your own or a service account
     * @param password  The plain text password to authenticate on
     * @return          The josso_sessionid from the cookie received when logging in
     * @throws IOException connection error
     */
    public String doSingleSignonLogin(String name, char[] pwd) throws IOException {
        
		String password = new String(pwd);
				
		//Create a config b/c we want to specify a non-infinate timeout
		RequestConfig.Builder rcb = RequestConfig.copy(RequestConfig.DEFAULT);
		rcb.setConnectTimeout(30 * 1000);
		rcb.setConnectionRequestTimeout(30 * 1000);
		RequestConfig rc = rcb.build();
				
        try (CloseableHttpClient httpClient = HttpClients.custom().setDefaultRequestConfig(rc).build()) {
			
	        List<NameValuePair> params = new ArrayList<>();
	        params.add(new BasicNameValuePair(JOSSO_CMD, JOSSO_VAL));
	        params.add(new BasicNameValuePair(JOSSO_USR, name));
	        params.add(new BasicNameValuePair(JOSSO_PWD, password));

        	URI loginUrl = buildLoginUrl();
	        HttpPost httpPost = new HttpPost(loginUrl);
	        httpPost.setEntity(new UrlEncodedFormEntity(params, "UTF-8"));
	        httpPost.addHeader("Accept", CONTENT_JSON);
	
			HttpClientContext context = HttpClientContext.create();


	        try (CloseableHttpResponse response = httpClient.execute(httpPost, context)) {

				if (response.getStatusLine().getStatusCode() < 400) {
					for (Cookie cookie: context.getCookieStore().getCookies()) {
						if (JOSSO_SID.equals(cookie.getName())) {
							String jossoId = cookie.getValue();
							return jossoId;
						}
					}
				} else {
					throw new IOException("Received status code " + response.getStatusLine().getStatusCode() + " from JSSON service");
				}

			}
			
			log.info("No josso token found in the server response");
        } catch (Exception e) {
			log.info("JSSON failed with an exception: " + e.getLocalizedMessage());

        }
        
        return null;
    }
	
    protected URI buildLoginUrl() {

		String scheme = getOption(JAAS_PARAM_REMOTE_SCHEME, DEFAULT_REMOTE_SCHEME);
		String host = getOption(JAAS_PARAM_REMOTE_HOST, DEFAULT_REMOTE_HOST);
		String path = getOption(JAAS_PARAM_REMOTE_PATH, DEFAULT_REMOTE_PATH);
		
        try {
            URIBuilder uriBuilder = new URIBuilder()
                    .setScheme(scheme)
                    .setHost(host)
                    .setPath(path);


            return uriBuilder.build();
        } catch (URISyntaxException e) {
        	log.severe("While building JSSON URI: " + scheme + "://" + host + path);
            return null;
        }
    }
	
	protected String getOption(String name, String defaultStr) {
		if (options.containsKey(name)) {
			return options.get(name).toString();
		} else {
			return defaultStr;
		}
	}
	
}
