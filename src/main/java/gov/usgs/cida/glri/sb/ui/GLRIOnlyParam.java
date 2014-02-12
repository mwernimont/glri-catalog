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
public enum GLRIOnlyParam {
	
	GLRI_PROJECT_ONLY("glri_only", "parentId");
	
	private final String shortName;
	private final String fullName;
	
	GLRIOnlyParam(String shortName, String fullName) {
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
	public GLRIOnlyParam getForShortName(String shortName) {
		shortName = StringUtils.trimToNull(shortName);
		if (shortName == null) return null;
		shortName = shortName.toLowerCase();
		
		
		for (GLRIOnlyParam tag : GLRIOnlyParam.values()) {
			if (tag.shortName.equals(shortName)) return tag;
		}
		
		return null;
	}
}
