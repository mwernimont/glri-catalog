package gov.usgs.cida.glri.sb.ui;

import org.apache.commons.lang3.StringUtils;

/**
 * GLRI parameters that are treated a full parameters on the GLRI site, but
 * are actually 'tags' on the ScienceBase site.
 * 
 * URL parameter construction is a bit odd - see where this enum is actually used
 * to see it.
 * @author eeverman
 */
public enum GLRIParam {
	
	MEDIUM("medium", "sample-medium"),
	PARAM_GROUP("param_group", "parameter-group"),
	PARAM("param", "parameter"),
	LOC_TYPE("loc_type", "location-type"),
	LOC_NAME("loc_name", "location-name"),
	FOCUS("focus", "focus-area"),
	UNKNOWN("", "");
	
	//Same for all grli tags
	private static final String glriSchema = "https://www.sciencebase.gov/vocab/GLRI";
	
	private final String localName;
	private final String remoteNameFrag;
	
	GLRIParam(String localName, String remoteNameFrag) {
		this.localName = localName;
		this.remoteNameFrag = remoteNameFrag;
	}
	
	public String getRemoteName() {
		return glriSchema + "/" + remoteNameFrag;
	}
	
	public String getLocalName() {
		return localName;
	}
	
	/**
	 * Finds a tag for a given shortName or null if it cannot be found.
	 * 
	 * @param localName Case Insensitive
	 * @return 
	 */
	public GLRIParam getForLocalName(String localName) {
		localName = StringUtils.trimToNull(localName);
		if (localName == null) return null;
		localName = localName.toLowerCase();
		
		
		for (GLRIParam tag : GLRIParam.values()) {
			if (tag.localName.equals(localName)) return tag;
		}
		
		return null;
	}
	
	
}
