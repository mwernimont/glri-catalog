package gov.usgs.cida.glri.sb.ui.vocab;

import com.google.common.io.CharStreams;
import gov.usgs.cida.glri.sb.ui.AppConfig;
import static gov.usgs.cida.glri.sb.ui.AppConfig.SCIENCEBASE_VOCAB_HOST;
import gov.usgs.cida.glri.sb.ui.Format;
import gov.usgs.cida.glri.sb.ui.GLRIUtil;

import java.io.InputStream;
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
public class ScienceBaseVocabQuery {
	
	public static final String DEFAULT_ENCODING = "UTF-8";
	public static final String SCIENCE_BASE_RESOURCE = "/gov/sciencebase/terms/";
	public static final String PARENT_ID_PARAM = "parentId";
	public static final String JSON = ".json";
	
	
	
	private Format format = Format.UNKNOWN;
	
	
	
	public String getQueryResponse(Map<String, String[]> requestParams) throws Exception {
		CloseableHttpClient httpclient = HttpClients.createDefault();
		URIBuilder uriBuild = new URIBuilder();
		uriBuild.setScheme("https");
		uriBuild.setHost(AppConfig.get(SCIENCEBASE_VOCAB_HOST));
		uriBuild.setPath("/vocab/categories");
		appendUserParams(requestParams, uriBuild);
		appendSystemParams(requestParams, uriBuild);
		
		HttpGet httpGet = new HttpGet(uriBuild.build());
		//System.out.println(httpGet.getURI());
		httpGet.addHeader("Accept", "application/json,application/xml,text/html");
		CloseableHttpResponse response = httpclient.execute(httpGet);

		HttpEntity entity = null;
		String stringFromStream = "";
		try {
			entity = response.getEntity();
			String encoding = GLRIUtil.findEncoding(entity, DEFAULT_ENCODING);
			stringFromStream = CharStreams.toString(new InputStreamReader(entity.getContent(), encoding));
		} catch (Exception e) {
			System.out.println("A-" + e.getMessage());
			try (InputStream data = getClass().getResourceAsStream(SCIENCE_BASE_RESOURCE + requestParams.get(PARENT_ID_PARAM)[0] + JSON)) {
				stringFromStream = CharStreams.toString(new InputStreamReader(data));
			} catch (Exception ee) {
				throw e; // if we cannot find the local file then throw the original exception
			}
		} finally {
			// close the resources quietly
			try{EntityUtils.consume(entity);}catch(Exception e){/*quiet*/};
			try{response.close();}catch(Exception e){/*quiet*/};
		}
		return stringFromStream;
	}
	
	public Format getRequestedFormat() {
		return format;
	}
	
	protected void appendUserParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		for (UserSpecifiedParams param : UserSpecifiedParams.values()) {
			String val = param.processParamValue(requestParams.get(param.getLocalName()));
			
			if (val != null) {
				uriBuild.addParameter(param.processParamName(val), val);
			}
		}
	}
	
	protected void appendSystemParams(Map<String, String[]> requestParams, URIBuilder uriBuild) {
		
		
		for (SystemSuppliedParams param : SystemSuppliedParams.values()) {
			
			if (param.getType().isAllowClientValue()) {
				String[] vals = requestParams.get(param.getLocalName());
				if (vals != null && vals.length > 0) {
					String val = StringUtils.trimToNull(vals[0]);

					if (val != null) {
						uriBuild.addParameter(param.getRemoteName(), val);
					}	
				} else if (param.getType().isAllowDefault() && param.hasDefault()) {
					//No client value, so use the default value
					uriBuild.addParameter(param.getRemoteName(), param.getDefaultValue());
				}
			} else {
				
				String defaultVal = param.getDefaultValue();
				
				if (param.getType().isLookupDefault()) {
					//This default is a key to lookup the value in the app config
					defaultVal = AppConfig.get(defaultVal);
				}
				//Client values not allowed - force in our default value
				uriBuild.addParameter(param.getRemoteName(), defaultVal);
			}
		}
			
	}

}
