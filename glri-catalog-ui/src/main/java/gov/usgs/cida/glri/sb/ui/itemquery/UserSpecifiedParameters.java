package gov.usgs.cida.glri.sb.ui.itemquery;

import gov.usgs.cida.glri.sb.ui.ParameterProcessor;
import org.apache.commons.lang3.StringUtils;

/**
 * GLRI parameters that are treated a full parameters on the GLRI site, but
 * are actually 'tags' on the ScienceBase site.
 * 
 * URL parameter construction is a bit odd - see where this enum is actually used
 * to see it.
 * @author eeverman
 */
public enum UserSpecifiedParameters implements ParameterProcessor {
	
	TEXT_QUERY("text_query", "q", null, false),
	LOC_TYPE("loc_type", "filter", "GLRILocationType", true),
	LOC_NAME("loc_name", "filter", "GLRIWaterFeature", true),
	FOCUS("focus", "filter", "GLRIFocusArea", true),
	TEMPLATE("template", "filter", "GLRITemplates", true),
	CATEGORY("resource", "filter", "browseCategory", false),
	UNKNOWN("", "", null, false);
	
	//Same for all grli tags, except we are in the process of switching to a new one...
	public static final String GLRI_SCHEMA = "https://www.sciencebase.gov/vocab/category/Great%20Lakes%20Restoration%20Initiative";
	
	private final String localName;
	private final String remoteParamName;
	private final String remoteTagName;
	private final boolean usesTagFilter;
	
	UserSpecifiedParameters(String localName, String remoteParamName, String remoteTagName, boolean usesTagFilter) {
		this.localName = localName;
		this.remoteParamName = remoteParamName;
		this.remoteTagName = remoteTagName;
		this.usesTagFilter = usesTagFilter;
	}
	
	public String getRemoteName() {
		return remoteParamName;
	}
	
	public String getRemoteTagName() {
		return remoteTagName;
	}
	
	public String getRemoteSchemaTagName() {
		return GLRI_SCHEMA + "/" + remoteTagName;
	}
	
	public String getLocalName() {
		return localName;
	}
	
	/**
	 * If true, this query parameter uses a tag style filter in ScienceBase,
	 * meaning that the param structure is not a simple name=value.
	 * @return 
	 */
	private boolean isUsingTagFilter() {
		return usesTagFilter;
	}
	
	/**
	 * Finds a tag for a given shortName or null if it cannot be found.
	 * 
	 * @param localName Case Insensitive
	 * @return tag
	 */
	public UserSpecifiedParameters getForLocalName(String localName) {
		localName = StringUtils.trimToNull(localName);
		if (localName == null) return null;
		localName = localName.toLowerCase();
		
		
		for (UserSpecifiedParameters tag : UserSpecifiedParameters.values()) {
			if (tag.localName.equals(localName)) return tag;
		}
		
		return null;
	}
	
	@Override
	public String processParamValue(String[] values) {
		if (values != null && values.length > 0) {
			String val = StringUtils.trimToNull(values[0]);
			if (val != null) {
				return processParamValue(val);
			}
		}
		return null;
	}
	
	@Override
	public String processParamValue(String value) {
		value = StringUtils.trimToNull(value);
		if (value != null) {
			if (this.isUsingTagFilter()) {
				return "tags={scheme:'" + this.getRemoteSchemaTagName() + "',name:'" + value + "'}";
			} else if (this.equals(CATEGORY)) {
				//its own special thing...
				return this.getRemoteTagName() + "=" + value;
			} else {
				return value;
			}
		} else {
			return null;
		}
	}
	
	
	@Override
	public String processParamName(String value) {
		return getRemoteName();
	}
}
