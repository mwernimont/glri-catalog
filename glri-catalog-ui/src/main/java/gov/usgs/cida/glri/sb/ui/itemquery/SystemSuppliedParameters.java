/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui.itemquery;

import gov.usgs.cida.glri.sb.ui.AppConfig;
import gov.usgs.cida.glri.sb.ui.ParamType;
import static gov.usgs.cida.glri.sb.ui.ParamType.*;
import gov.usgs.cida.glri.sb.ui.ParameterProcessor;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author eeverman
 */
public enum SystemSuppliedParameters implements ParameterProcessor {
	
	/** Format of results to come back */
	FORMAT("format", "format", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "json"),
	/** Determines which fields are included in the SB response */
	FIELDS("fields", "fields", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE,
			"url,facets,title,summary,spatial,distributionLinks,browseCategories,contacts,webLinks,systemTypes,hasChildren"),			
	/** Max number of records to return */
	MAX_RECORDS("max", "max", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "1000"),
	/** browseCategory filter is a weird one.  Its format is: &filter=browseCategory=<CATEGORY> */
	CATEGORIES("resource", "", INCLUDE_IF_PRESENT),
	/** bounding box filter is std lower left to upper right */
	SPATIAL("spatial", "searchExtent", INCLUDE_IF_PRESENT),
	/** specify data results to be faceted in results for drill-down */
	FACETS("search_facets", "facets", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "browseCategory"),
	/** I think this indicates that the service is 'search' */
	SERVICE("service", "s", INCLUDE_ALWAYS_WITH_DEFAULT_VALUE_ONLY, "Search"),
	/**
	 * Specifies the ID of the community to search within.  
	 * This is specified as a key lookup so that it can be configured on the
	 * server the app runs on.  The prod server will talk to the prod SB,
	 * which has a different community ID for GLRI than the SB beta server.
	 */
	COMMUNITY_ID("folder", "ancestors", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, AppConfig.get(AppConfig.SCIENCEBASE_GLRI_COMMUNITY_ID));
	
	private final String localName;
	private final String remoteName;
	private final String defaultValue;
	private final ParamType type;
	
	SystemSuppliedParameters(String localName, String remoteName, ParamType type) {
		this.localName = localName;
		this.remoteName = remoteName;
		this.type = type;
		this.defaultValue = null;
	}
	
	SystemSuppliedParameters(String localName, String remoteName, ParamType type, String defaultValue) {
		this.localName = localName;
		this.remoteName = remoteName;
		this.type = type;
		this.defaultValue = defaultValue;
	}
	
	public String getRemoteName() {
		return remoteName;
	}
	
	public String getLocalName() {
		return localName;
	}
	
	public ParamType getType() {
		return type;
	}
	
	public String getDefaultValue() {
		return defaultValue;
	}
	
	public boolean hasDefault() {
		return defaultValue != null;
	}
	
	/**
	 * Finds a tag for a given shortName or null if it cannot be found.
	 * 
	 * @param shortName Case Insensitive
	 * @return 
	 */
	public SystemSuppliedParameters getForLocalName(String shortName) {
		shortName = StringUtils.trimToNull(shortName);
		if (shortName == null) return null;
		shortName = shortName.toLowerCase();
		
		
		for (SystemSuppliedParameters tag : SystemSuppliedParameters.values()) {
			if (tag.localName.equals(shortName)) return tag;
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
		return StringUtils.trimToNull(value);
	}
	
	@Override
	public String processParamName(String value) {
		return this.getRemoteName();
	}
}
