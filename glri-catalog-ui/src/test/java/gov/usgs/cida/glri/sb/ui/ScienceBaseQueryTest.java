/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.http.HttpEntity;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;
import org.json.simple.JSONObject;
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
public class ScienceBaseQueryTest {
	static final String TEST_ENCODING = "XXX";
	
	ScienceBaseQuery query;
	HashMap<String, String[]> requestParams;
	URIBuilder uriBuild;
	
	public ScienceBaseQueryTest() {
	}
	
	@BeforeClass
	public static void setUpClass() {
	}
	
	@AfterClass
	public static void tearDownClass() {
	}
	
	@Before
	public void setUp() {
		query = new ScienceBaseQuery();
		requestParams = new HashMap<String, String[]>();
		uriBuild = new URIBuilder();
		

		uriBuild.setScheme("https");
		uriBuild.setHost("sb.gov");
		uriBuild.setPath("/catalog/items");
	}
	
	@After
	public void tearDown() {
		query = null;
	}


	/**
	 * Test of findEncoding method, of class ScienceBaseQuery.
	 */
	@Test
	public void testFindEncodingSimple() {
		String result = query.findEncoding("text/html; charset=utf-8", TEST_ENCODING);
		assertEquals(ScienceBaseQuery.DEFAULT_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithExtraSpacesAndTabs() {
		String result = query.findEncoding("  \t text/html;  \t  charset=utf-8   \t ", TEST_ENCODING);
		assertEquals(ScienceBaseQuery.DEFAULT_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithNoEncodingPresent() {
		String result = query.findEncoding("  \t text/html ", TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithSomeOtherJunkPresent() {
		String result = query.findEncoding("  \t text/html;  \t  somethingElse   \t ", TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithANonCharsetKey() {
		String result = query.findEncoding("  \t text/html;  \t  NotTheCarset=utf-8   \t ", TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithNullValue() {
		String result = query.findEncoding((String)null, TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
	@Test
	public void appendStandardParamsWithNoClientParameters() throws Exception {
		query.appendStandardParams(requestParams, uriBuild);
		
		List<NameValuePair> params = uriBuild.getQueryParams();
		
		
		assertEquals("Search", findNVPVal(params, "s"));
		assertEquals("1000", findNVPVal(params, "max"));
		assertEquals("title,summary,spatial,distributionLinks,browseCategories,contacts", findNVPVal(params, "fields"));
		assertEquals("json", findNVPVal(params, "format"));
		assertEquals("browseCategory", findNVPVal(params, "facets"));
		assertEquals(5, params.size());
	}
	
	@Test
	public void appendStandardParamsWithClientResouceParameter() throws Exception {
		
		requestParams.put("resource", new String[] {"MyType"});
		query.appendStandardParams(requestParams, uriBuild);

		System.out.println(uriBuild.build().toString());
		
		List<NameValuePair> params = uriBuild.getQueryParams();
		
		
		assertEquals("Search", findNVPVal(params, "s"));
		assertEquals("1000", findNVPVal(params, "max"));
		assertEquals("title,summary,spatial,distributionLinks,browseCategories,contacts", findNVPVal(params, "fields"));
		assertEquals("json", findNVPVal(params, "format"));
		assertEquals("browseCategory", findNVPVal(params, "facets"));
		assertEquals("browseCategory=MyType", findNVPVal(params, "filter"));
		assertEquals(6, params.size());
	}
	
	/**
	 * Finds a NameValuePair base on the name.
	 * @param list
	 * @param name
	 * @return 
	 */
	public NameValuePair findNVP(List<NameValuePair> list, String name) {
		for (NameValuePair n : list) {
			if (name.equals(n.getName())) return n;
		}
		
		return null;
	}
	
	/**
	 * Finds a NameValuePair and returns the value
	 * @param list
	 * @param name
	 * @return 
	 */
	public String findNVPVal(List<NameValuePair> list, String name) {
		for (NameValuePair n : list) {
			if (name.equals(n.getName())) return n.getValue();
		}
		
		return null;
	}

}