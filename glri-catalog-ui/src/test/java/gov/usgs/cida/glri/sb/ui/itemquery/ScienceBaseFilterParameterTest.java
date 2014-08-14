package gov.usgs.cida.glri.sb.ui.itemquery;


import static gov.usgs.cida.glri.sb.ui.itemquery.UserSpecifiedParameters.*;
import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.*;

/**
 *
 * @author eeverman
 */
public class ScienceBaseFilterParameterTest {
	
	
	
	@Test
	public void standardSchemeBasedFilter() throws Exception {
		
		String expectedVal = "tags={scheme:'https://www.sciencebase.gov/vocab/GLRI/location-type',name:'Lake'}";
		
		assertEquals("filter", LOC_TYPE.processParamName(null));	
		assertEquals(expectedVal, LOC_TYPE.processParamValue("Lake"));
		assertEquals(expectedVal, LOC_TYPE.processParamValue(new String[] {"Lake"}));	
	}
	
	@Test
	public void categoryFilter() throws Exception {
		
		String expectedVal = "browseCategory=MyType";
		
		assertEquals("filter", CATEGORY.processParamName(null));	
		
		assertEquals(expectedVal, CATEGORY.processParamValue("MyType"));	
		assertEquals(expectedVal, CATEGORY.processParamValue(new String[] {"MyType"}));	
	}
	
	@Test
	public void textQuery() throws Exception {
		
		
		assertEquals("q", TEXT_QUERY.processParamName(null));	
		
		assertEquals("test", TEXT_QUERY.processParamValue("test"));	
		assertEquals("test", TEXT_QUERY.processParamValue(new String[] {"test"}));	
	}
}
