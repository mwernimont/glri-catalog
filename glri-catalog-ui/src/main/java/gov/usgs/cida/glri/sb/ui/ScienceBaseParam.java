/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package gov.usgs.cida.glri.sb.ui;

import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author eeverman
 */
public enum ScienceBaseParam {
	
	TEXT_QUERY("text_query", "q"),
	FORMAT("format", "format"),
	FIELDS("fields", "fields"),
	CATEGORIES("resource", ""),				//browseCategory filter is a weird one.  Its format is: &filter=browseCategory=<CATEGORY>
	SPATIAL("spatial", "searchExtent");
	
	
	private final String shortName;
	private final String fullName;
	
	ScienceBaseParam(String shortName, String fullName) {
		this.shortName = shortName;
		this.fullName = fullName;
	}
	
	public String getFullName() {
		return fullName;
	}
	
	public String getShortName() {
		return shortName;
	}
	
	/**
	 * Finds a tag for a given shortName or null if it cannot be found.
	 * 
	 * @param shortName Case Insensitive
	 * @return 
	 */
	public ScienceBaseParam getForShortName(String shortName) {
		shortName = StringUtils.trimToNull(shortName);
		if (shortName == null) return null;
		shortName = shortName.toLowerCase();
		
		
		for (ScienceBaseParam tag : ScienceBaseParam.values()) {
			if (tag.shortName.equals(shortName)) return tag;
		}
		
		return null;
	}
}
