package gov.usgs.cida.glri.sb.ui.itemquery;

import gov.usgs.cida.glri.sb.ui.AppConfig;
import gov.usgs.cida.glri.sb.ui.GLRIUtil;
import gov.usgs.cida.glri.sb.ui.itemquery.ScienceBaseQuery;
import static gov.usgs.cida.glri.sb.ui.itemquery.UserSpecifiedParameters.GLRI_SCHEMA;
import java.util.HashMap;
import java.util.List;
import org.apache.http.NameValuePair;
import org.apache.http.client.utils.URIBuilder;
import org.junit.After;
import org.junit.AfterClass;
import static org.junit.Assert.*;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;

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


	@Test
	public void testTest() {
		String glriCommunityId = AppConfig.get(AppConfig.SCIENCEBASE_GLRI_COMMUNITY_ID);
		
		//Ensure we have an ID assigned for the tests
		assertTrue(glriCommunityId != null && glriCommunityId.length() > 0);
	}
	
	@Test
	public void appendStandardParamsWithNoClientParameters() throws Exception {
		query.appendSystemParams(requestParams, uriBuild);
		
		List<NameValuePair> params = uriBuild.getQueryParams();

		assertEquals("Search", findNVPVal(params, "s"));
		assertEquals("1000", findNVPVal(params, "max"));
		assertEquals("url,facets,title,summary,spatial,distributionLinks,browseCategories,contacts,webLinks,systemTypes,hasChildren", findNVPVal(params, "fields"));
		assertEquals("json", findNVPVal(params, "format"));
		assertEquals("browseCategory", findNVPVal(params, "facets"));
		assertEquals(AppConfig.get(AppConfig.SCIENCEBASE_GLRI_COMMUNITY_ID), findNVPVal(params, "ancestors"));
		assertEquals(6, params.size());
	}
	
	@Test
	public void appendStandardParamsWithClientResouceParameter() throws Exception {
		
		requestParams.put("resource", new String[] {"MyType"});
		query.appendUserParams(requestParams, uriBuild);
		
		List<NameValuePair> params = uriBuild.getQueryParams();
		
		assertEquals("browseCategory=MyType", findNVPVal(params, "filter"));
		assertEquals(1, params.size());
	}
	
	@Test
	public void appendGLRIFilterParams() throws Exception {
		
		requestParams.put("loc_type", new String[] {"Lake"});
		query.appendUserParams(requestParams, uriBuild);
		
		List<NameValuePair> params = uriBuild.getQueryParams();
		
		assertEquals("tags={scheme:'" + GLRI_SCHEMA + "/" + UserSpecifiedParameters.LOC_TYPE.getRemoteTagName() + "',name:'Lake'}", findNVPVal(params, "filter"));
		assertEquals(1, params.size());
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