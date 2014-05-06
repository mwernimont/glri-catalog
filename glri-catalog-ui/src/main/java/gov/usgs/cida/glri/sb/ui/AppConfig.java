package gov.usgs.cida.glri.sb.ui;

import gov.usgs.cida.config.DynamicReadOnlyProperties;
import java.util.Map.Entry;

/**
 * Mildly ugly singleton configuration point that reads its configuration from
 * Environment parameters.  These can be added to the context.xml file like this:
 * 
 * 	&ltEnvironment name="gov.usgs.cida.glri.sb.ui.SCIENCE_BASE_HOST" value="beta.sciencebase.gov"
 *		type="java.lang.String" override="false"/&gt;
 *
 * @author eeverman
 */
public class AppConfig {
	
	/** Key prefix appended infront of all key names */
	public static final String KEY_BASE_PREFIX = "gov.usgs.cida.glri.sb.ui.";
	
	public static final String SCIENCEBASE_HOST = KEY_BASE_PREFIX + "SCIENCEBASE_HOST";
	public static final String SCIENCEBASE_GLRI_COMMUNITY_ID = KEY_BASE_PREFIX + "SCIENCEBASE_GLRI_COMMUNITY_ID";
	
	/**
	 * If set to true, the application uses a local json file for all responses, rather than
	 * attempting to contact ScienceBase.  This is handy when doing development b/c
	 * the beta.sciencebase.gov server is only visable inside the usgs, requiring
	 * VPN.  No filtering is done - the same file is returned each time.
	 */
	public static final String SCIENCEBASE_GLRI_LOCAL_DEV_MODE = KEY_BASE_PREFIX + "SCIENCEBASE_GLRI_LOCAL_DEV_MODE";
	
	private static AppConfig appConfig;
	private DynamicReadOnlyProperties props;
	
	private AppConfig() {

		try {
			
			DynamicReadOnlyProperties drp = new DynamicReadOnlyProperties();
			drp.addJNDIContexts(DynamicReadOnlyProperties.DEFAULT_JNDI_CONTEXTS);
			props = drp;
			
			
			//Set the beta server as the default value for the ScienceBase Host
			//Should this be removed??
			String host = props.get(SCIENCEBASE_HOST);
			if (host == null) {
				props.put(SCIENCEBASE_HOST, "beta.sciencebase.gov");
			}
			
			String commId = props.get(SCIENCEBASE_GLRI_COMMUNITY_ID);
			if (commId == null) {
				props.put(SCIENCEBASE_GLRI_COMMUNITY_ID, "52e6a0a0e4b012954a1a238a");
			}
			

		} catch (Exception e) {
			e.printStackTrace(System.out);
			throw new RuntimeException();
		}


	}
	
	public static synchronized AppConfig instance() {
		if (appConfig == null) {
			appConfig = new AppConfig();
		}
		
		return appConfig;
	}
	
	public static synchronized void flush() {
		appConfig = null;
	}
	
	
	public static String get(String key) {
		return get(key, null);
	}
	
	public static String get(String key, String valueIfNull) {
		AppConfig inst = AppConfig.instance();
		Object val = inst.props.getProperty(key, null);
		
		if (val != null) {
			return val.toString();
		} else {
			return null;
		}
	}
}
