/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

import org.apache.commons.lang3.StringUtils;
import static gov.usgs.cida.glri.sb.ui.ParamType.*;

/**
 *
 * @author eeverman
 */
public enum ScienceBaseParam {
	
	TEXT_QUERY("text_query", "q", INCLUDE_IF_PRESENT), /** Basic ad-hoc text search */
	FORMAT("format", "format", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "json"), /** Format of results to come back */
	FIELDS("fields", "fields", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE,
			"title,summary,spatial,distributionLinks,browseCategories,contacts"), /** Fields returned from ScienceBase */
	MAX_RECORDS("max", "max", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "1000"), /** Max number of records to return */
	CATEGORIES("resource", "", INCLUDE_IF_PRESENT),	/** browseCategory filter is a weird one.  Its format is: &filter=browseCategory=<CATEGORY> */
	SPATIAL("spatial", "searchExtent", INCLUDE_IF_PRESENT), /** bounding box filter is std lower left to upper right */
	FACETS("search_facets", "facets", INCLUDE_IF_PRESENT_OTHERWISE_USE_DEFAULT_VALUE, "browseCategory"), /** specify data results to be faceted in results for drill-down */
	SERVICE("service", "s", INCLUDE_ALWAYS_WITH_DEFAULT_VALUE_ONLY, "Search"); /** I think this indicates that the service is 'search' */
	
	private final String localName;
	private final String remoteName;
	private final String defaultValue;
	private final ParamType type;
	
	ScienceBaseParam(String localName, String remoteName, ParamType type) {
		this.localName = localName;
		this.remoteName = remoteName;
		this.type = type;
		this.defaultValue = null;
	}
	
	ScienceBaseParam(String localName, String remoteName, ParamType type, String defaultValue) {
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
	public ScienceBaseParam getForLocalName(String shortName) {
		shortName = StringUtils.trimToNull(shortName);
		if (shortName == null) return null;
		shortName = shortName.toLowerCase();
		
		
		for (ScienceBaseParam tag : ScienceBaseParam.values()) {
			if (tag.localName.equals(shortName)) return tag;
		}
		
		return null;
	}
}
