package gov.usgs.cida.glri.sb.ui.itemquery;

import gov.usgs.cida.glri.sb.ui.itemquery.UserSpecifiedParameters;
import gov.usgs.cida.glri.sb.ui.itemquery.SystemSuppliedParameters;
import com.google.common.io.CharStreams;
import gov.usgs.cida.glri.sb.ui.AppConfig;
import gov.usgs.cida.glri.sb.ui.Format;
import gov.usgs.cida.glri.sb.ui.GLRIUtil;
import java.io.InputStreamReader;
import java.util.Map;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.utils.URIBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

/**
 * Builds a query to ScienceBase w/ mappings between local parameters and SB
 * parameters.
 * @author eeverman
 */
public class ScienceBaseQuery {
	
	
	public static final String DEFAULT_ENCODING = "UTF-8";
	
	private final Format format = Format.UNKNOWN;
	
	
	public String getQueryResponse(Map<String, String[]> requestParams) throws Exception {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		URIBuilder uriBuild = new URIBuilder();
		uriBuild.setScheme("https");
		uriBuild.setHost(AppConfig.get(AppConfig.SCIENCEBASE_HOST));
		uriBuild.setPath("/catalog/items");
		appendUserParams(requestParams, uriBuild);
		appendSystemParams(requestParams, uriBuild);
		appendSpatialParams(requestParams, uriBuild);
		
		HttpGet httpGet = new HttpGet(uriBuild.build());
		//System.out.println(httpGet.getURI());
		httpGet.addHeader("Accept", "application/json,application/xml,text/html");
		CloseableHttpResponse response1 = httpclient.execute(httpGet);

		try {
			//System.out.println(response1.getStatusLine());
			HttpEntity entity = response1.getEntity();
			
			String encoding = GLRIUtil.findEncoding(entity, DEFAULT_ENCODING);
			String stringFromStream = CharStreams.toString(new InputStreamReader(entity.getContent(), encoding));
			
			EntityUtils.consume(entity);
			
			return stringFromStream;
		} finally {
			response1.close();
		}

	}
	
	public Format getRequestedFormat() {
		return format;
	}
	
	protected void appendUserParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		for (UserSpecifiedParameters tag : UserSpecifiedParameters.values()) {
			String val = tag.processParamValue(requestParams.get(tag.getLocalName()));

			if (val != null) {
				val = val.replace(" %26 ", " & "); // prevent double encoding
				uriBuild.addParameter(tag.processParamName(val), val);
			}
		}
	}
	
	protected void appendSystemParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		
		
		for (SystemSuppliedParameters tag : SystemSuppliedParameters.values()) {
			
			if (tag.getType().isAllowClientValue()) {
				String[] vals = requestParams.get(tag.getLocalName());
				if (vals != null && vals.length > 0) {
					String val = StringUtils.trimToNull(vals[0]);

					if (val != null) {
						uriBuild.addParameter(tag.getRemoteName(), val);
					}	
				} else if (tag.getType().isAllowDefault() && tag.hasDefault()) {
					//No client value, so use the default value
					uriBuild.addParameter(tag.getRemoteName(), tag.getDefaultValue());
				}
			} else {
				
				String defaultVal = tag.getDefaultValue();
				
				if (tag.getType().isLookupDefault()) {
					//This default is a key to lookup the value in the app config
					defaultVal = AppConfig.get(defaultVal);
				}
				//Client values not allowed - force in our default value
				uriBuild.addParameter(tag.getRemoteName(), defaultVal);
			}
		}
			
	}
	
	protected void appendSpatialParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		String[] spatialQuery = requestParams.get(SystemSuppliedParameters.SPATIAL);
		
		if((spatialQuery != null) && (spatialQuery.length > 0)) {
			String val = StringUtils.trimToNull(spatialQuery[0]);
			if (val != null) {
				//System.out.println("Spatial Param: [" + val + "]");
				uriBuild.addParameter(SystemSuppliedParameters.SPATIAL.getRemoteName(), val);
			}
		}
	}
}
