package gov.usgs.cida.glri.sb.ui;

import gov.usgs.cida.glri.sb.ui.itemquery.ScienceBaseQuery;
import static org.junit.Assert.assertEquals;
import org.junit.Test;

/**
 *
 * @author eeverman
 */
public class GLRIUtilTest {
	static final String TEST_ENCODING = "XXX";
	
	public GLRIUtilTest() {
	}
	
	/**
	 * Test of findEncoding method, of class ScienceBaseQuery.
	 */
	@Test
	public void testFindEncodingSimple() {
		String result = GLRIUtil.findEncoding("text/html; charset=utf-8", TEST_ENCODING);
		assertEquals(ScienceBaseQuery.DEFAULT_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithExtraSpacesAndTabs() {
		String result = GLRIUtil.findEncoding("  \t text/html;  \t  charset=utf-8   \t ", TEST_ENCODING);
		assertEquals(ScienceBaseQuery.DEFAULT_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithNoEncodingPresent() {
		String result = GLRIUtil.findEncoding("  \t text/html ", TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithSomeOtherJunkPresent() {
		String result = GLRIUtil.findEncoding("  \t text/html;  \t  somethingElse   \t ", TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithANonCharsetKey() {
		String result = GLRIUtil.findEncoding("  \t text/html;  \t  NotTheCarset=utf-8   \t ", TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
	@Test
	public void testFindEncodingWithNullValue() {
		String result = GLRIUtil.findEncoding((String)null, TEST_ENCODING);
		assertEquals(TEST_ENCODING, result);
	}
	
}