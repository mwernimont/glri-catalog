package gov.usgs.cida.glri.sb.ui.sbapi;

import javax.naming.Context;
import javax.naming.InitialContext;

import org.json.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

import java.util.Map;

import gov.usgs.cida.glri.sb.ui.AppConfig;

public class ScienceBaseRestClientTest {

	// NOTE this class requirs tomcat-julia.jar and catalina.jar in classpath

	// THis is the code used to test the ScienceBase provided code (modified to use JNDI) but is integration - not unit test.
	
	/**
	
	@BeforeClass
	public static void setup() throws Exception {
        // Create initial context
        System.setProperty(Context.INITIAL_CONTEXT_FACTORY, "org.apache.naming.java.javaURLContextFactory");
        System.setProperty(Context.URL_PKG_PREFIXES, "org.apache.naming");            
        InitialContext ic = new InitialContext();

        ic.createSubcontext("java:");
        ic.createSubcontext("java:/comp");
        ic.createSubcontext("java:/comp/env");
        ic.createSubcontext("java:/comp/env/jdbc");
       
        
        ic.bind("java:/comp/env/gov.usgs.cida.glri.sb.ui.SCIENCEBASE_AUTH", "my-beta.usgs.gov");
        ic.bind("java:/comp/env/gov.usgs.cida.glri.sb.ui.SCIENCEBASE_HOST", "beta.sciencebase.gov");
        ic.bind("java:/comp/env/gov.usgs.cida.glri.sb.ui.SCIENCEBASE_VOCAB_HOST", "www.sciencebase.gov");
        ic.bind("java:/comp/env/gov.usgs.cida.glri.sb.ui.SCIENCEBASE_GLRI_COMMUNITY_ID", "52e6a0a0e4b012954a1a238a");
        ic.bind("java:/comp/env/gov.usgs.cida.glri.sb.ui.SCIENCEBASE_GLRI_COMMUNITY_USR", "glriservice");
        ic.bind("java:/comp/env/gov.usgs.cida.glri.sb.ui.SCIENCEBASE_GLRI_COMMUNITY_PWD", "password");
	}
	
	@Test
	public void loginTest() throws Exception{

        // This login only works in ENV_PROD
        String username = AppConfig.get(AppConfig.SCIENCEBASE_GLRI_COMMUNITY_USR);
        String password = AppConfig.get(AppConfig.SCIENCEBASE_GLRI_COMMUNITY_PWD);
//	        String parentId = "52e6a0a0e4b012954a1a238a";

        // Create new SB Rest Client
        try (ScienceBaseRestClient sb = new ScienceBaseRestClient()) {
            // Test SB/JOSSO login
            String jossoSessionId = sb.login(username, password);
            assertNotNull("josso should not be null", jossoSessionId);
            System.out.println("Josso Session Id: " + jossoSessionId);

            // Create a new item
//	            JSONObject newItemJson = new JSONObject()
//	                    .put("title", "A new item")
//	                    .put("body", "A test item created with the javasb project")
//	                    .put("parentId", parentId);
//	            JSONObject newItem = sb.createSbItem(newItemJson);
//	            System.out.println(newItem.toString(2));
            
            // Test getting private sb item
//	            JSONObject item = sb.getSbItem(newItem.getString("id"));
            JSONObject item = sb.getSbItem("5661bf4fe4b0082979818466");
            assertNotNull("item id should not be null", item.getString("id"));
            System.out.println(item.toString(2));

        }
    }    
	*/
	public static Map<?,?> jsonToMap(String json) throws ParseException {
    	JSONParser j = new JSONParser();
    	JSONObject o = (JSONObject)j.parse(json);
    	Map<?,?> jsonMap = (Map<?,?>)o.get("response");
        return jsonMap;
	}
	
}
