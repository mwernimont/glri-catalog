/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

import java.util.Map;
import org.apache.http.HttpEntity;
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

}