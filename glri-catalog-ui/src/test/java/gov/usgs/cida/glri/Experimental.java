/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri;

import gov.usgs.cida.glri.sb.ui.ScienceBaseQuery;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.json.simple.JSONObject;
import org.json.simple.JSONValue;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author eeverman
 */
public class Experimental {
	
	public Experimental() {
	}
	
	@BeforeClass
	public static void setUpClass() {
	}
	
	@AfterClass
	public static void tearDownClass() {
	}
	
	@Before
	public void setUp() {
	}
	
	@After
	public void tearDown() {
	}

	@Test
	public void hello() throws Exception {
		ScienceBaseQuery query = new ScienceBaseQuery();
		
		HashMap paramMap = new HashMap();
		paramMap.put("medium", new String[]{"water"});
		paramMap.put("param_group", new String[]{"Nutrient"});
		String str = query.getQueryResponse(paramMap);
		
		System.out.println(str);
		
	}
	
	
	protected void getQueryResponse() throws Exception {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		URIBuilder uriBuild = new URIBuilder();
		uriBuild.setScheme("https");
		uriBuild.setHost("www.sciencebase.gov");
		uriBuild.setPath("/catalog/items");
		uriBuild.setParameter("s", "Search");
		uriBuild.setParameter("q", "");
		uriBuild.setParameter("format", "json");
		uriBuild.setParameter("filter", "tags={scheme:'https://www.sciencebase.gov/vocab/GLRI/sample-medium',name:'water'}");
		uriBuild.setParameter("fields", "title,summary");
		
		
		HttpGet httpGet = new HttpGet(uriBuild.build());
		System.out.println(httpGet.getURI());
		//HttpGet httpGet = new HttpGet("https://www.sciencebase.gov/catalog/items?q=&format=json&filter=tags%3D%7Bscheme:%27https://www.sciencebase.gov/vocab/GLRI/sample-medium%27,name:%27water%27%7D&fields=title%2Csummary&s=Search");
		httpGet.addHeader("Accept", "application/json");
		CloseableHttpResponse response1 = httpclient.execute(httpGet);
		// The underlying HTTP connection is still held by the response object
		// to allow the response content to be streamed directly from the network socket.
		// In order to ensure correct deallocation of system resources
		// the user MUST either fully consume the response content  or abort request
		// execution by calling CloseableHttpResponse#close().

		try {
			System.out.println(response1.getStatusLine());
			HttpEntity entity1 = response1.getEntity();
			JSONObject jo = (JSONObject)JSONValue.parse(new InputStreamReader(entity1.getContent(), "UTF-8"));

			System.out.println(jo.toJSONString());
			EntityUtils.consume(entity1);
		} finally {
			response1.close();
		}

	}
}